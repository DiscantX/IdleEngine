import type {Entity } from "../data/interfaces/Entities";

export class ComponentAPI {
    get<T>(
        entity: Entity,
        componentType: string
    ): T | undefined {
            return entity.components[componentType] as T | undefined;
    }
}