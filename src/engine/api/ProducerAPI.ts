import type { GameState } from "../core/interfaces/GameState";
import type { ProducerDefinition } from "../data/Definitions";
import type { BigNumber } from "../values/BigNumber";
import { ResourceAPI } from "./ResourceAPI";
import { evaluatePurchase, resolveCosts } from "./Purchasing";


/**
 * Responsible for reading owned producer quantities and processing
 * purchases against a game's ProducerDefinitions, coordinating with
 * ResourceAPI to check and deduct costs. Mirrors UpgradeAPI's shape —
 * producers and upgrades are both quantitative, count-based content,
 * differing only in what the count means and what it feeds into
 * (ModifierSystem for upgrades, ProductionSystem for producers).
 */
export class ProducerAPI {
    private resourceAPI: ResourceAPI;

    constructor(resourceAPI: ResourceAPI) {
        this.resourceAPI = resourceAPI;
    }

    /**
     * Returns the current owned count of a given producer.
     * @param state - GameState object containing the current state of the game.
     * @param producerId - The producer to look up.
     * @returns The current count owned. Returns zero if not defined.
     */
    getCount(state: GameState, producerId: string): number {
        return state.producers[producerId] ?? 0;
    }

    /**
     * Checks whether a producer could currently be purchased — not at
     * maxCount, and every cost affordable — without spending anything or
     * changing state. Useful for UI code deciding whether to enable a
     * purchase button. Since state can change between this check and an
     * actual purchase() call, this is advisory only; purchase() always
     * re-verifies independently rather than trusting a prior canPurchase()
     * result.
     * @param state - The game state to check against.
     * @param definition - The producer to check.
     * @returns True if purchase() would currently succeed.
     */
    canPurchase(state: GameState, definition: ProducerDefinition): boolean {
        const currentCount = this.getCount(state, definition.id);
        return evaluatePurchase(state, definition, currentCount, this.resourceAPI).affordable;
    }

    /**
     * Attempts to purchase one more unit of a producer. Checks that all
     * costs can be afforded and the producer isn't already at maxCount
     * before deducting anything, so a purchase never partially charges
     * the player.
     * @param state - The game state to modify.
     * @param definition - The producer to purchase.
     * @returns Whether the purchase succeeded.
     */
    purchase(state: GameState, definition: ProducerDefinition): boolean {
        const currentCount = this.getCount(state, definition.id);
        const evaluation = evaluatePurchase(state, definition, currentCount, this.resourceAPI);

        if (!evaluation.affordable) {
            return false;
        }

        for (const resolved of evaluation.resolvedCosts) {
            this.resourceAPI.add(state, resolved.resource, resolved.amount.negate());
        }

        state.producers[definition.id] = currentCount + 1;
        return true;
    }

    /**
     * Resolves the cost of the next unit of a producer, regardless of
     * whether it's currently affordable. Useful for UI code that needs
     * to display a cost even when the player can't yet afford it.
     * @param state - The game state to read the current count from.
     * @param definition - The producer to resolve costs for.
     * @returns The resolved cost amounts for the next purchase.
     */
    getNextCosts(state: GameState, definition: ProducerDefinition): { resource: string; amount: BigNumber }[] {
        const currentCount = this.getCount(state, definition.id);
        return resolveCosts(definition, currentCount);
    }
}