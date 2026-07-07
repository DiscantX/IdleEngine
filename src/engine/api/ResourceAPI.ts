import type { GameState } from "../core/GameState";

export class ResourceAPI {

    add(
        state: GameState,
        resourceId: string,
        amount: number
    ): void {

        if (state.resources[resourceId] === undefined) {
            state.resources[resourceId] = 0;
        }

        state.resources[resourceId] += amount;
    }


    get(
        state: GameState,
        resourceId: string
    ): number {

        return state.resources[resourceId] ?? 0;
    }
}