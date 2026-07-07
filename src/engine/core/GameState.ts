import type { Entity } from "../data/Entities";

export interface GameState {
    time: number;

    resources: {
        [resourceId: string]: number;
    };

    entities: {
      [entityId: string]: Entity;  
    };
}