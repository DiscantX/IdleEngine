import type { GameState } from "../core/interfaces/GameState";
import type { SimulationSystem } from "../core/interfaces/SimulationSystem"
import type { ProductionComponent } from "../data/interfaces/Components"
import type { ProducerDefinition } from "../data/Definitions";
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import { ProducerAPI } from "../api/ProducerAPI";
import { BigNumber } from "../values/BigNumber"
import { ModifierSystem } from "./ModifierSystem";

/**
 * Applies production each simulation tick, from two sources:
 *   1. Entities carrying a ProductionComponent (individually-identified,
 *      qualitative content — e.g. found or one-off production sources).
 *   2. Owned ProducerDefinitions (quantitative, count-based content —
 *      e.g. purchasable producers), where total base rate is the
 *      per-unit rate times quantity owned.
 * Both sources add to their resource based on the elapsed time.
 *
 * Effective rate is a calculated result of all modifiers applied to the target,
 * the target being a string representation of the resource to modify.
 */
export class ProductionSystem implements SimulationSystem {
    private componentAPI: ComponentAPI;
    private resourceAPI: ResourceAPI;
    private modifierSystem: ModifierSystem;
    private producerDefinitions: ProducerDefinition[];
    private producerAPI: ProducerAPI;

    /**
     * @param componentAPI - Used to read components off entities.
     * @param resourceAPI - Used to add produced amounts to resources.
     * @param modifierSystem - Used to resolve the effective value of baseValue after folding in every modifier.
     * @param producerDefinitions - The full set of producer definitions the game
     * has registered, iterated each tick alongside entity-based production.
     * @param producerAPI - Used to read each producer's currently owned quantity.
     */
    constructor(
        componentAPI: ComponentAPI,
        resourceAPI : ResourceAPI,
        modifierSystem: ModifierSystem,
        producerDefinitions: ProducerDefinition[],
        producerAPI: ProducerAPI
    ) {
        this.componentAPI = componentAPI;
        this.resourceAPI = resourceAPI;
        this.modifierSystem = modifierSystem;
        this.producerDefinitions = producerDefinitions;
        this.producerAPI = producerAPI;
    }

    /**
     * Advances production from both entity-based ProductionComponents and
     * owned ProducerDefinitions, adding effective rate * deltaTime to
     * each corresponding resource.
     * @param state - The game state to modify.
     * @param deltaTime - The elapsed time, in seconds, to simulate.
     */
    update(
        state: GameState,
        deltaTime: number,
    ): void {
        const deltaTimeBig = BigNumber.fromNumber(deltaTime);

        for (const entityId in state.entities) {
            const entity = state.entities[entityId];
            const production = this.componentAPI.get<ProductionComponent>(entity, "production");

            if(production === undefined) {
                continue;
            }

            const resource: string = production.resource;
            const target = `production:${resource}`;
            const effectiveRate = this.modifierSystem.getEffectiveValue(state, target, production.rate);

            this.resourceAPI.add(
                state,
                resource,
                effectiveRate.multiply(deltaTimeBig)
            );
        }

        for (const definition of this.producerDefinitions) {
            const quantity = this.producerAPI.getQuantity(state, definition.id);

            if (quantity <= 0) {
                continue;
            }

            const resource = definition.resource;
            const target = `production:${resource}`;
            const perUnitRate = definition.rate.resolve(quantity);
            const baseRate = perUnitRate.multiply(BigNumber.fromNumber(quantity));
            const effectiveRate = this.modifierSystem.getEffectiveValue(state, target, baseRate);

            this.resourceAPI.add(
                state,
                resource,
                effectiveRate.multiply(deltaTimeBig)
            );
        }
    }
}