import type { GameState } from "../core/interfaces/GameState";
import type { SimulationSystem } from "../core/interfaces/SimulationSystem"
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import type { ProductionComponent } from "../data/interfaces/Components"


export class ProductionSystem implements SimulationSystem {
    private componentAPI: ComponentAPI;
    private resourceAPI: ResourceAPI;

    constructor(
        componentAPI: ComponentAPI,
        resourceAPI : ResourceAPI
    ) {
        this.componentAPI = componentAPI;
        this.resourceAPI = resourceAPI;
    }

    update(
        state: GameState,
        deltaTime: number,
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

            this.resourceAPI.add(
                state,
                resource,
                rate * deltaTime
            );
        }
    }
}