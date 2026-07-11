import type { GameState } from "../core/interfaces/GameState";
import type { Purchasable } from "../data/Definitions";
import type { BigNumber } from "../values/BigNumber";
import { ResourceAPI } from "./ResourceAPI";

/**
 * Resolves every cost for a Purchasable definition at its current
 * count and checks whether all preconditions for acquisition are met
 * (not at maxCount, every cost affordable). Generalized, standalone
 * version of what was previously a private method on UpgradeAPI —
 * shared across any content type that extends Purchasable (upgrades,
 * producers, entities), regardless of what "count" means for that
 * content or what happens after a successful purchase.
 * @param state - The game state to check against.
 * @param definition - The Purchasable content to evaluate.
 * @param currentCount - The caller's current count for this definition
 * (an upgrade level, a producer quantity, an entity count — meaning
 * is caller-defined; this function only compares it against maxCount).
 * @param resourceAPI - Used to check current resource balances.
 * @returns Whether the purchase is currently possible, and the
 * resolved cost amounts (only meaningful/complete if affordable is true).
 */
export function evaluatePurchase(
    state: GameState,
    definition: Purchasable,
    currentCount: number,
    resourceAPI: ResourceAPI
): { affordable: boolean; resolvedCosts: { resource: string; amount: BigNumber }[] } {
    if (definition.maxCount !== undefined && currentCount >= definition.maxCount) {
        return { affordable: false, resolvedCosts: [] };
    }

    const resolvedCosts: { resource: string; amount: BigNumber }[] = [];

    for (const cost of definition.costs) {
        const amount = cost.amount.resolve(currentCount);
        const balance = resourceAPI.get(state, cost.resource);
        if (balance.lessThan(amount)) {
            return { affordable: false, resolvedCosts: [] };
        }
        resolvedCosts.push({ resource: cost.resource, amount });
    }

    return { affordable: true, resolvedCosts };
}