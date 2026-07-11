import type { BuildingDefinition } from "../../engine/data/Definitions";
import { BigNumber } from "../../engine/values/BigNumber";

/**
 * A basic production building for the example game: produces gold
 * at a fixed rate for as long as it exists in the game state.
 * Demonstrates the minimal shape of a data-driven entity definition —
 * an id plus a components bag, matching what EntityAPI.create() expects.
 */
export const goldMine: BuildingDefinition = {
    id: "goldMine",
    name: "Gold Mine",
    description: "A mine full of gold.",
    components: {
        production: {
            resource: "gold",
            rate: BigNumber.fromNumber(25)
        }
    }
};

export const goldVault: BuildingDefinition = {
    id: "goldVault",
    name: "Gold Vault",
    description: "A vault of gold coins. Warning: Don't try swimming in it, coins are not liquid.",
    components: {
        decay: {
            resource: "gold",
            rate: BigNumber.fromNumber(5)
        }
    }
};