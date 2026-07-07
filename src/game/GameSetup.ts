import { Engine } from "../engine/core/Engine";
import type { GameState } from "../engine/core/interfaces/GameState";
import { Simulation } from "../engine/core/Simulation";
import { Clock } from "../engine/core/Clock";
import { ResourceAPI } from "../engine/api/ResourceAPI";
import { ProductionSystem } from "../engine/systems/ProductionSystem";
import { EntityAPI } from "../engine/api/EntityAPI";
import { goldMine } from "./definitions/buildings";
import { ComponentAPI } from "../engine/api/ComponentAPI";
import { LocalTimeSource } from "../engine/core/LocalTimeSource";

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
    const productionSystem = new ProductionSystem(componentAPI, resourceAPI);
    const simulation = new Simulation([productionSystem]);
    const localTimeSource = new LocalTimeSource();
    const clock = new Clock(simulation, localTimeSource);

    return new Engine(
        state,
        clock
    );
}