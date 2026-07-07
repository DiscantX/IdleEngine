import { Engine } from "../engine/core/Engine";
import type { GameState } from "../engine/core/GameState";
import { Simulation } from "../engine/core/Simulation";
import { ResourceAPI } from "../engine/api/ResourceAPI";
import { ProductionSystem } from "../engine/systems/ProductionSystem";
import { EntityAPI } from "../engine/api/EntityAPI";
import { goldMine } from "./definitions/buildings";
import { ComponentAPI } from "../engine/api/ComponentAPI";

export function createGame(): Engine {

    const entityAPI = new EntityAPI();

    const mineEntity = entityAPI.create(
        "mine_001",
        goldMine.components
    )

    const state: GameState = {
        time: 0,
        resources: {
            gold: 0
        },
        entities: {
            mine_001: mineEntity
        }
    };

    const resourceAPI = new ResourceAPI();
    const componentAPI = new ComponentAPI();
    const productionSystem = new ProductionSystem(componentAPI);
    const simulation = new Simulation(
        productionSystem,
        resourceAPI
    );

    return new Engine(
        state,
        simulation
    );
}