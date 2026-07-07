import type { Entity } from "../data/interfaces/Entities";

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