import type { GameState } from "../core/interfaces/GameState";
import { BigNumber } from "../values/BigNumber"

/**
 * Responsible for reading and modifying resource amounts. Games should
 * go through this API rather than touching state.resources directly,
 * so the engine has a single point to add validation, clamping, or
 * change-tracking in the future.
 */
export class ResourceAPI {
    /**
     * Adds an amount to a resource, creating it at zero first if it doesn't yet exist.
     * @param state - The game state to modify.
     * @param resourceId - The resource to add to.
     * @param amount - The amount to add. May either be a number or BigNumber.
     */
    add(state: GameState, resourceId: string, amount: number | BigNumber): void {
        const bigAmount = BigNumber.from(amount)
        state.resources[resourceId] ??= BigNumber.ZERO;
        state.resources[resourceId] = state.resources[resourceId].add(bigAmount);   
    }

    /**
     * Gets the current amount of a resource, defaulting to zero if it doesn't exist.
     * @param state - The game state to read from.
     * @param resourceId - The resource to look up.
     * @returns The current amount of the resource. Returns BigNumber.ZERO if not defined.
     */
    get(state: GameState, resourceId: string): BigNumber {
        return state.resources[resourceId] ?? BigNumber.ZERO;
    }
}