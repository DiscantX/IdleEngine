import type { GameState } from "../core/GameState";
import type { SimulationSystem } from "../core/SimulationSystem"
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import type { ProductionComponent } from "../data/Components"


export class ProductionSystem implements SimulationSystem {
    private componentAPI: ComponentAPI;

    constructor(
        componentAPI: ComponentAPI
    ) {
        this.componentAPI = componentAPI;
    }

    update(
        state: GameState,
        deltaTime: number,
        resourceAPI: ResourceAPI
    ): void {
        for (const entityId in state.entities) {
            const entity = state.entities[entityId];

            const production = this.componentAPI.get<ProductionComponent>(
                entity,
                "production"
            );

            if(production == undefined) {
                continue;
            }

            const resource = production.resource;
            const rate = production.rate;

            resourceAPI.add(
                state,
                resource,
                rate * deltaTime
            );
        }
    }
}