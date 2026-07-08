import type { Entity } from "../data/interfaces/Entities";

/**
 * Responsible for constructing entities. Games should create entities
 * through this API rather than building the Entity shape directly, so
 * the engine has a single point to add validation, ID generation, or
 * migrations in the future.
 */
export class EntityAPI {
    /**
     * Creates a new entity with the given ID and components.
     * @param id - The unique identifier for the entity.
     * @param components - The components to attach to the entity, keyed by component type.
     * @returns The newly created entity.
     */
    create(id: string, components: {[componentType: string]: object;}): Entity {
        return {id, components};
    }
}