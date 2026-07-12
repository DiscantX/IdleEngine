import type { GameState } from "../core/interfaces/GameState";
import type { UpgradeDefinition } from "../data/Definitions";
import type { BigNumber } from "../values/BigNumber";
import { ResourceAPI } from "./ResourceAPI";
import { evaluatePurchase, resolveCosts } from "./Purchasing";

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
    getCount(state: GameState, upgradeId: string): number {
        return state.upgrades[upgradeId] ?? 0;
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
        const currentCount = this.getCount(state, definition.id);
        return evaluatePurchase(state, definition, currentCount, this.resourceAPI).affordable;
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
        const currentCount = this.getCount(state, definition.id);
        const evaluation = evaluatePurchase(state, definition, currentCount, this.resourceAPI);

        if (!evaluation.affordable) {
            return false;
        }

        for (const resolved of evaluation.resolvedCosts) {
            this.resourceAPI.add(state, resolved.resource, resolved.amount.negate());
        }

        state.upgrades[definition.id] = currentCount + 1;
        return true;
    }

    /**
     * Resolves the cost of the next level of an upgrade, regardless of
     * whether it's currently affordable. Useful for UI code that needs
     * to display a cost even when the player can't yet afford it.
     * @param state - The game state to read the current count from.
     * @param definition - The upgrade to resolve costs for.
     * @returns The resolved cost amounts for the next purchase.
     */
    getNextCosts(state: GameState, definition: UpgradeDefinition): { resource: string; amount: BigNumber }[] {
        const currentCount = this.getCount(state, definition.id);
        return resolveCosts(definition, currentCount);
    }
}