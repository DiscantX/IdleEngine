import { Engine } from "../engine/core/Engine";
import { Simulation } from "../engine/core/Simulation";
import { Clock } from "../engine/core/Clock";
import { LocalTimeSource } from "../engine/core/LocalTimeSource";
import type { GameState } from "../engine/core/interfaces/GameState";

import type { ProducerDefinition } from "../engine/data/Definitions";

import { Serializer } from "../engine/persistence/Serializer";
import { SaveEncoder } from "../engine/persistence/SaveEncoder";
import { LocalStorageAdapter } from "../engine/persistence/LocalStorageAdapter";
import { SaveManager } from "../engine/persistence/SaveManager";

import { ResourceAPI } from "../engine/api/ResourceAPI";
import { EntityAPI } from "../engine/api/EntityAPI";
import { ComponentAPI } from "../engine/api/ComponentAPI";
import { UpgradeAPI } from "../engine/api/UpgradeAPI";
import { ProducerAPI } from "../engine/api/ProducerAPI";

import { BigNumber } from "../engine/values/BigNumber"

import { ProductionSystem } from "../engine/systems/ProductionSystem";
import { DecaySystem } from "../engine/systems/DecaySystem";
import { ModifierSystem } from "../engine/systems/ModifierSystem";

import { miningSpeed } from "./definitions/upgrades";
import { goldMine, goldVault } from "./definitions/buildings";

/**
 * Builds a fully wired game instance: initial state, entities,
 * systems, and the clock that drives simulation.
 * @returns A ready-to-use Engine instance.
 */
export function createGame(): Engine {
    // Create the starting entity and initial game state.
    const entityAPI = new EntityAPI();
    const mineEntity = entityAPI.create(
        "mine_001",
        goldMine.components
    )
    const vaultEntity = entityAPI.create(
    "vault_001",
    goldVault.components
    )

    const state: GameState = {
        time: 0,
        resources: {
            gold: BigNumber.ZERO
        },
        entities: {
            mine_001: mineEntity,
            vault_001: vaultEntity
        },
        upgrades: {},
        producers: {}
    };

    // Wire up the simulation: systems, the Simulation that runs them,
    // and the Clock that advances state over time.
    const resourceAPI = new ResourceAPI();
    const componentAPI = new ComponentAPI();

    const upgradeAPI = new UpgradeAPI(resourceAPI);
    const producerAPI = new ProducerAPI(resourceAPI);
    const producerDefinitions: ProducerDefinition[] = []; //TODO: Fill array
    const modifierSystem = new ModifierSystem([miningSpeed], upgradeAPI)
    const productionSystem = new ProductionSystem(componentAPI, resourceAPI, modifierSystem, producerDefinitions, producerAPI);
    const decaySystem = new DecaySystem(componentAPI, resourceAPI, modifierSystem);
    const simulation = new Simulation([
        productionSystem,
        decaySystem
        ]
    );

    const localTimeSource = new LocalTimeSource();
    const clock = new Clock(simulation, localTimeSource);

    // Wire up the save/load pipeline: Serializer <-> SaveEncoder <-> StorageAdapter,
    // coordinated by SaveManager.
    const serializer = new Serializer();
    const encoder = new SaveEncoder();
    const storageAdapter = new LocalStorageAdapter();
    const saveManager = new SaveManager("idle-engine-save", 1, serializer, encoder, storageAdapter);

    return new Engine(
        state,
        clock,
        saveManager,
        upgradeAPI
    );
}