import { BigNumber } from "../../engine/values/BigNumber"

/**
 * A basic production building for the example game: produces gold
 * at a fixed rate for as long as it exists in the game state.
 * Demonstrates the minimal shape of a data-driven entity definition —
 * an id plus a components bag, matching what EntityAPI.create() expects.
 */
export const goldMine = {
    id: "goldMine",
    components: {
        production: {
            resource: "gold",
            rate: BigNumber.fromNumber(25)
        }
    }
};

export const goldVault = {
    id: "goldVault",
    components: {
        decay: {
            resource: "gold",
            rate: BigNumber.fromNumber(5)
        }
    }
};