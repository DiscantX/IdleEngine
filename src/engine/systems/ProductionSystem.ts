import type { GameState } from "../core/interfaces/GameState";
import type { SimulationSystem } from "../core/interfaces/SimulationSystem"
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import type { ProductionComponent } from "../data/interfaces/Components"
import { BigNumber } from "../values/BigNumber"

/**
 * Applies production components each simulation tick, adding
 * resources based on each entity's rate and the elapsed time.
 */
export class ProductionSystem implements SimulationSystem {
    private componentAPI: ComponentAPI;
    private resourceAPI: ResourceAPI;

    /**
     * @param componentAPI - Used to read components off entities.
     * @param resourceAPI - Used to add produced amounts to resources.
     */
    constructor(
        componentAPI: ComponentAPI,
        resourceAPI : ResourceAPI
    ) {
        this.componentAPI = componentAPI;
        this.resourceAPI = resourceAPI;
    }

    /**
     * Advances production for every entity with a production component,
     * adding rate * deltaTime to the corresponding resource.
     * @param state - The game state to modify.
     * @param deltaTime - The elapsed time, in seconds, to simulate.
     */
    update(
        state: GameState,
        deltaTime: number,
    ): void {
        for (const entityId in state.entities) {
            const entity = state.entities[entityId];
            const production = this.componentAPI.get<ProductionComponent>(entity, "production");

            if(production === undefined) {
                continue;
            }

            const resource: string = production.resource;
            const deltaTimeBig = BigNumber.fromNumber(deltaTime);

            this.resourceAPI.add(
                state,
                resource,
                production.rate.multiply(deltaTimeBig)
            );
        }
    }
}