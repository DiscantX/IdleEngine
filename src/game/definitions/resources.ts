import type { ResourceDefinition } from "../../engine/data/Definitions";

/**
 * The game's single resource. Deliberately generic, in keeping with
 * the game's self-aware meta theme — the player is just watching
 * The Number go up.
 */
export const theNumber: ResourceDefinition = {
    id: "theNumber",
    name: "The Number",
    description: "It goes up."
};