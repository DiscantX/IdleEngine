import type { GameState } from "./GameState";

/**
 * Contract for a system that participates in simulation ticks. The
 * Simulation calls update() on every registered system each time the
 * game state advances by a given amount of time.
 */
export interface SimulationSystem {
    /**
     * Advances this system's simulation logic by the given elapsed time.
     * @param state - The game state to read from and modify.
     * @param deltaTime - The elapsed time, in seconds, to simulate.
     */
    update(
        state: GameState,
        deltaTime: number
    ): void;
}