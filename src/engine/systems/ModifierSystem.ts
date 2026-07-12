import type { GameState } from "../core/interfaces/GameState";
import type { UpgradeDefinition } from "../data/Definitions"
import type { UpgradeAPI } from "../api/UpgradeAPI"
import { BigNumber } from "../values/BigNumber"

/**
 * Computes effective values by folding all currently-owned upgrades'
 * modifiers into a base value, live, on every call — rather than
 * mutating components at purchase time. This keeps GameState clean
 * (components always hold their original base values) and makes
 * modifiers fully reversible (selling an upgrade or resetting on
 * prestige requires no undo logic, since nothing was ever mutated).
 *
 * definitions and upgradeAPI are constructor-injected, following the
 * engine's "systems own their dependencies" convention, since this
 * class needs to know the full set of possible upgrades (owned by the
 * game) and how many levels of each are currently owned (via GameState).
 */
export class ModifierSystem {
    private definitions: UpgradeDefinition[];
    private upgradeAPI: UpgradeAPI;

    /**
     * @param definitions - The full set of upgrade definitions the game
     * has registered, searched each call for modifiers matching a target.
     * @param upgradeAPI - Used to read each upgrade's current level.
     */
    constructor(definitions: UpgradeDefinition[], upgradeAPI: UpgradeAPI) {
        this.definitions = definitions;
        this.upgradeAPI = upgradeAPI;
    }

    /**
     * Resolves the effective value of baseValue after folding in every
     * modifier, from every currently-owned upgrade, whose target matches
     * the given target string. Modifiers combine in three stages so that
     * purchase order never affects the result:
     *   1. All "add" modifiers are summed and added to baseValue.
     *   2. All "multiplyAdditive" modifiers are summed into one combined
     *      percentage bonus (e.g. two +10% modifiers become +20% total),
     *      applied once as a single multiplier.
     *   3. Each "multiplyCompound" modifier is applied as its own
     *      independent multiplier, compounding with one another.
     * @param state - The game state to read upgrade levels from.
     * @param target - The game-defined key identifying which modifiers
     * apply here. Callers (e.g. ProductionSystem) define the convention
     * for constructing these strings; ModifierSystem only matches them.
     * @param baseValue - The starting value before any modifiers are folded in.
     * @returns The effective value after all matching modifiers are applied.
     */
    getEffectiveValue(state: GameState, target: string, baseValue: BigNumber): BigNumber {
        let totalAdd = BigNumber.ZERO;
        let additiveBonus = BigNumber.ZERO;
        let compoundFactor = BigNumber.fromNumber(1);

        for (const definition of this.definitions) {
            const level = this.upgradeAPI.getCount(state, definition.id);
            if (level <= 0) continue;

            for (const modifier of definition.modifiers) {
                if (modifier.target !== target) continue;

                const resolved = modifier.magnitude.resolve(level);

                switch (modifier.operation) {
                    case "add":
                        totalAdd = totalAdd.add(resolved);
                        break;
                    case "multiplyAdditive":
                        additiveBonus = additiveBonus.add(resolved);
                        break;
                    case "multiplyCompound":
                        compoundFactor = compoundFactor.multiply(resolved);
                        break;
                }
            }
        }

        return baseValue.add(totalAdd).multiply(BigNumber.fromNumber(1).add(additiveBonus)).multiply(compoundFactor);
    }
}