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
import { ComponentAPI } from "../engine/api/ComponentAPI";
import { UpgradeAPI } from "../engine/api/UpgradeAPI";
import { ProducerAPI } from "../engine/api/ProducerAPI";

import { ProductionSystem } from "../engine/systems/ProductionSystem";
import { ModifierSystem } from "../engine/systems/ModifierSystem";

/**
 * Builds a fully wired game instance: initial state, entities,
 * systems, and the clock that drives simulation.
 * @returns A ready-to-use Engine instance.
 */
export function createGame(): Engine {
    const state: GameState = {
        time: 0,
        resources: {
        },
        entities: {
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
    const modifierSystem = new ModifierSystem([], upgradeAPI) //TODO: Fill array
    const productionSystem = new ProductionSystem(componentAPI, resourceAPI, modifierSystem, producerDefinitions, producerAPI);
    const simulation = new Simulation([
        productionSystem,
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