import type { GameState } from "./GameState";
import type { SimulationSystem } from "./SimulationSystem";
import { ResourceAPI } from "../api/ResourceAPI";

export class Simulation {
    private systems: SimulationSystem[]
    private resourceAPI: ResourceAPI;

    constructor(
        systems: SimulationSystem,
        resourceAPI: ResourceAPI
    ) {
        this.systems = systems;
        this.resourceAPI = resourceAPI;
    }

    update(
        state: GameState,
        deltaTime: number
    ): void {

        state.time += deltaTime;

        for (const system of this.systems) {
            system.update(
                state,
                deltaTime
            );
        }
    }
}