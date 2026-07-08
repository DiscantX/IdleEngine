import type { GameState} from "../../core/interfaces/GameState"

/**
 * The wrapper format for a saved game: a versioned snapshot of GameState.
 * This describes the pre-serialization shape, holding live GameState
 * data (including class instances like BigNumber) rather than the
 * JSON-safe output the Serializer eventually produces from it.
 */
export interface SaveData {
    /**
     * The save format version. Used by Migration to determine which
     * transformations, if any, need to be applied to bring an older
     * save up to the current format.
     */
    version: number;
    /** The game state captured at the time of saving. */
    state: GameState;
}