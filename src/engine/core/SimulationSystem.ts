import type { GameState } from "./GameState";

export interface SimulationSystem {
    update(
        state: GameState,
        deltaTime: number
    ): void;
}