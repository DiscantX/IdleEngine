import type {Entity } from "../data/Entities";

export class ComponentAPI {
    get<T>(
        entity: Entity,
        componentType: string
    ): T | undefined {
            return entity.components[componentType] as T | undefined;
    }
}