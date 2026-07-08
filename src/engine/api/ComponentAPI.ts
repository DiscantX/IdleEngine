import type {Entity } from "../data/interfaces/Entities";

/**
 * Responsible for reading components off entities. Systems should
 * access components through this API rather than reaching into
 * entity.components directly.
 */
export class ComponentAPI {
    /**
     * Retrieves a typed component from an entity.
     * @param entity - The entity to read from.
     * @param componentType - The key identifying which component to retrieve.
     * @returns The component, cast to T, or undefined if the entity doesn't have it.
     */
    get<T>(entity: Entity, componentType: string): T | undefined {
        return entity.components[componentType] as T | undefined;
    }
}