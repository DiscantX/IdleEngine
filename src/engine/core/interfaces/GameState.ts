import type { Entity } from "../../data/interfaces/Entities";
import type { BigNumber } from "../../values/BigNumber";

/**
 * The complete, serializable state of a running game: elapsed
 * simulation time, resource amounts, and all entities. This is the
 * single object that systems read from and write to each tick.
 */
export interface GameState {
    /** Total elapsed simulation time, in seconds. */
    time: number;

    /** Current amount of each resource, keyed by resource ID. */
    resources: {
        [resourceId: string]: BigNumber;
    };

    /** All entities currently in the game, keyed by entity ID. */
    entities: {
      [entityId: string]: Entity;  
    };
}