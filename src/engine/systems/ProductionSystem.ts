import type { GameState } from "../core/interfaces/GameState";
import type { SimulationSystem } from "../core/interfaces/SimulationSystem"
import type { ProductionComponent } from "../data/interfaces/Components"
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import { BigNumber } from "../values/BigNumber"
import { ModifierSystem } from "./ModifierSystem";

/**
 * Applies production components each simulation tick, adding
 * resources based on each entity's effective rate and the elapsed time.
 * 
 * Effective rate is a calculated result of all modifiers applied to the target,
 * the target being a string representation of the resource to modify.
 */
export class ProductionSystem implements SimulationSystem {
    private componentAPI: ComponentAPI;
    private resourceAPI: ResourceAPI;
    private modifierSystem: ModifierSystem;

    /**
     * @param componentAPI - Used to read components off entities.
     * @param resourceAPI - Used to add produced amounts to resources.
     * @param modifierSystem - Used to resolve the effective value of baseValue after folding in every modifier.
     */
    constructor(
        componentAPI: ComponentAPI,
        resourceAPI : ResourceAPI,
        modifierSystem: ModifierSystem
    ) {
        this.componentAPI = componentAPI;
        this.resourceAPI = resourceAPI;
        this.modifierSystem = modifierSystem;
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
            const target = `production:${resource}`;
            const effectiveRate = this.modifierSystem.getEffectiveValue(state, target, production.rate);

            this.resourceAPI.add(
                state,
                resource,
                effectiveRate.multiply(deltaTimeBig)
            );
        }
    }
}