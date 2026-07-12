import type { GameState } from "../core/interfaces/GameState";
import type { Purchasable } from "../data/Definitions";
import type { BigNumber } from "../values/BigNumber";
import { ResourceAPI } from "./ResourceAPI";

/**
 * Resolves every cost for a Purchasable definition at a given count,
 * without checking affordability. Used both by evaluatePurchase() (to
 * avoid resolving each Value twice) and by callers — like UI code —
 * that need to display costs regardless of whether they're currently
 * affordable, which evaluatePurchase() alone can't provide since it
 * returns no cost information when affordable is false.
 * @param definition - The Purchasable content whose costs to resolve.
 * @param currentCount - The count to resolve each cost's Value against.
 * @returns The resolved cost amounts, one per entry in definition.costs.
 */
export function resolveCosts(
    definition: Purchasable,
    currentCount: number
): { resource: string; amount: BigNumber }[] {
    return definition.costs.map(cost => ({
        resource: cost.resource,
        amount: cost.amount.resolve(currentCount)
    }));
}

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
 * fully resolved cost amounts regardless of affordability.
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

    const resolvedCosts: { resource: string; amount: BigNumber }[] = resolveCosts(definition, currentCount);

    for (const cost of resolvedCosts) {
        const balance = resourceAPI.get(state, cost.resource);
        if (balance.lessThan(cost.amount)) {
            return { affordable: false, resolvedCosts: resolvedCosts };
        }
    }

    return { affordable: true, resolvedCosts };
}