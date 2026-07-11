import type { GameState } from "../core/interfaces/GameState";
import type { UpgradeDefinition } from "../data/Definitions";
import type { BigNumber } from "../values/BigNumber";
import { ResourceAPI } from "./ResourceAPI";

/**
 * Responsible for reading upgrade levels and processing purchases against a game's UpgradeDefinitions,
 * coordinating with ResourceAPI to check and deduct costs."
 */
export class UpgradeAPI {
    private resourceAPI: ResourceAPI;

    constructor(resourceAPI: ResourceAPI) {
        this.resourceAPI = resourceAPI;
    }

    /**
     * Returns the current level of a given upgrade.
     * @param state - GameState object containing the current state of the game.
     * @param upgradeId - The upgrade to look up.
     * @returns The current level of the upgrade. Returns zero if not defined.
     */
    getLevel(state: GameState, upgradeId: string): number {
        return state.upgrades[upgradeId] ?? 0;
    }

    /**
     * Resolves every cost for an upgrade at its current level and checks
     * whether all preconditions for purchase are met (not maxed out, and
     * every cost affordable). Shared by canPurchase() and purchase() so
     * the check logic exists in exactly one place, while purchase() can
     * still reuse the resolved amounts for deduction without resolving
     * each Value a second time.
     * @param state - The game state to check against.
     * @param definition - The upgrade to evaluate.
     * @returns Whether the purchase is currently possible, and the
     * resolved cost amounts (only meaningful/complete if affordable is true).
     */
    private evaluatePurchase(state: GameState, definition: UpgradeDefinition): {affordable: boolean; resolvedCosts: {resource: string; amount: BigNumber}[]} {
        const currentLevel = this.getLevel(state, definition.id);

        if (definition.maxLevel !== undefined && currentLevel >= definition.maxLevel) {
            return { affordable: false, resolvedCosts: [] };
        }

        const resolvedCosts: { resource: string; amount: BigNumber }[] = [];

        for (const cost of definition.costs) {
            const amount = cost.amount.resolve(currentLevel);
            const balance = this.resourceAPI.get(state, cost.resource);
            if (balance.lessThan(amount)) {
                return { affordable: false, resolvedCosts: [] };
            }
            resolvedCosts.push({ resource: cost.resource, amount });
        }

        return { affordable: true, resolvedCosts };
    }

    /**
     * Checks whether an upgrade could currently be purchased — not maxed
     * out, and every cost affordable — without spending anything or
     * changing state. Useful for UI code deciding whether to enable a
     * purchase button. Since state can change between this check and an
     * actual purchase() call, this is advisory only; purchase() always
     * re-verifies independently rather than trusting a prior canPurchase()
     * result.
     * @param state - The game state to check against.
     * @param definition - The upgrade to check.
     * @returns True if purchase() would currently succeed.
     */
    canPurchase(state: GameState, definition: UpgradeDefinition): boolean {
        return this.evaluatePurchase(state, definition).affordable;
    }

    /**
     * Attempts to purchase the next level of an upgrade. Checks that all
     * costs can be afforded and the upgrade isn't already maxed out
     * before deducting anything, so a purchase never partially charges
     * the player.
     * @param state - The game state to modify.
     * @param definition - The upgrade to purchase.
     * @returns Whether the purchase succeeded.
     */
    purchase(state: GameState, definition: UpgradeDefinition): boolean {
        const evaluation = this.evaluatePurchase(state, definition);

        if (!evaluation.affordable) {
            return false;
        }

        for (const resolved of evaluation.resolvedCosts) {
            this.resourceAPI.add(state, resolved.resource, resolved.amount.negate());
        }

        state.upgrades[definition.id] = this.getLevel(state, definition.id) + 1;
        return true;
    }
}