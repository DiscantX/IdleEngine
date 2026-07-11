import type { GameState } from "../core/interfaces/GameState";

/**
 * Responsible for read-only queries over GameState that don't belong
 * to any single content type's own API — e.g. questions spanning all
 * entities, regardless of which EntityDefinition (if any) they trace
 * back to. Keeps ad-hoc state inspection behind an API rather than
 * scattered inline scans wherever a count or lookup is needed.
 */
export class QueryAPI {
    /**
     * Counts how many entities currently in the game trace back to a
     * given EntityDefinition, via each entity's definitionId. Used for
     * cap-checking (Purchasable.maxCount) against qualitative-identity
     * content, where individual entities — not a separate count — are
     * the source of truth for how many exist.
     * @param state - The game state to read from.
     * @param definitionId - The EntityDefinition id to count entities for.
     * @returns The number of entities with a matching definitionId.
     */
    countEntitiesByDefinition(state: GameState, definitionId: string): number {
        let count = 0;

        for (const entityId in state.entities) {
            if (state.entities[entityId].definitionId === definitionId) {
                count++;
            }
        }

        return count;
    }
}