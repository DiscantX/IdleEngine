import type { EntityDefinition } from "../../engine/data/Definitions";
import { BigNumber } from "../../engine/values/BigNumber";

/**
 * A basic production building for the example game: produces gold
 * at a fixed rate for as long as it exists in the game state.
 * Demonstrates the minimal shape of a data-driven entity definition —
 * an id plus a components bag, matching what EntityAPI.create() expects.
 *
 * costs is empty since goldMine isn't currently acquired through any
 * purchase path — GameSetup.ts still creates it directly at startup.
 * EntityDefinition requires costs (via Purchasable), so this is a
 * placeholder until an entity-acquisition flow exists.
 */
export const goldMine: EntityDefinition = {
    id: "goldMine",
    name: "Gold Mine",
    description: "A mine full of gold.",
    costs: [],
    components: {
        production: {
            resource: "gold",
            rate: BigNumber.fromNumber(25)
        }
    }
};

/**
 * A basic decay source for the example game: drains gold at a fixed
 * rate for as long as it exists in the game state. Also not currently
 * acquired through any purchase path — see goldMine's note above.
 */
export const goldVault: EntityDefinition = {
    id: "goldVault",
    name: "Gold Vault",
    description: "A vault of gold coins. Warning: Don't try swimming in it, coins are not liquid.",
    costs: [],
    components: {
        decay: {
            resource: "gold",
            rate: BigNumber.fromNumber(5)
        }
    }
};