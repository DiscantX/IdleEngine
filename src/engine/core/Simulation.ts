import type { GameState } from "./interfaces/GameState";
import type { SimulationSystem } from "./interfaces/SimulationSystem";

/**
 * Orchestrates simulation advancement by running a fixed list of
 * registered systems, in order, against a GameState each tick.
 */
export class Simulation {
    private systems: SimulationSystem[]

    /**
     * @param systems - The systems to run, in execution order, on every update.
     */
    constructor(systems: SimulationSystem[]) {
        this.systems = systems;
    }

    /**
     * Advances simulation time and runs every registered system.
     * @param state - The game state to modify.
     * @param deltaTime - The elapsed time, in seconds, to simulate.
     */
    update(state: GameState, deltaTime: number): void {
        state.time += deltaTime;

        for (const system of this.systems) {
            system.update(state, deltaTime);
        }
    }
}