import type { GameState } from "./interfaces/GameState";
import type { SimulationSystem } from "./interfaces/SimulationSystem";

export class Simulation {
    private systems: SimulationSystem[]

    constructor(
        systems: SimulationSystem[],
    ) {
        this.systems = systems;
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