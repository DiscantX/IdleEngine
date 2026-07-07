import type { Entity } from "../data/Entities";

export class EntityAPI {
    create(
        id: string,
        components: {
            [componentType: string]: object;
        }
    ):
    Entity {
        return {
            id,
            components
        };
    }
}