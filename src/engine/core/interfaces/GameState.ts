import type { Entity } from "../../data/interfaces/Entities";
import type { BigNumber } from "../../values/BigNumber";

export interface GameState {
    time: number;

    resources: {
        [resourceId: string]: BigNumber;
    };

    entities: {
      [entityId: string]: Entity;  
    };
}