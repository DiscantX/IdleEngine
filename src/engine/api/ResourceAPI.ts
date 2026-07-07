import type { GameState } from "../core/interfaces/GameState";
import { BigNumber } from "../values/BigNumber"

export class ResourceAPI {
    /**
     * Adds an amount to a resource, creating it at zero first if it doesn't yet exist.
     * @param state - The game state to modify.
     * @param resourceId - The resource to add to.
     * @param amount - The amount to add.
     */
    add(state: GameState, resourceId: string, amount: BigNumber): void {
        state.resources[resourceId] ??= BigNumber.ZERO;
        state.resources[resourceId] = state.resources[resourceId].add(amount);   
    }

    /**
     * Gets the current amount of a resource, defaulting to zero if it doesn't exist.
     * @param state - The game state to read from.
     * @param resourceId - The resource to look up.
     * @returns The current amount of the resource.
     */
    get(state: GameState, resourceId: string): BigNumber {
        return state.resources[resourceId] ?? BigNumber.ZERO;
    }
}