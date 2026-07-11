import type { GameState } from "../core/interfaces/GameState";
import type { SimulationSystem } from "../core/interfaces/SimulationSystem"
import { ResourceAPI } from "../api/ResourceAPI";
import { ComponentAPI } from "../api/ComponentAPI";
import type { DecayComponent } from "../data/interfaces/Components"
import { BigNumber } from "../values/BigNumber"
import { ModifierSystem } from "./ModifierSystem";


/**
 * Applies decay components each simulation tick, subtracting
 * resources based on each entity's effecctive rate and the elapsed time.
 *
 * Effective rate is a calculated result of all modifiers applied to the target,
 * the target being a string representation of the resource to modify.
 * 
 * By default, decay is clamped so a resource cannot go below zero;
 * individual decay components may opt out via clampAtZero: false.
 */
export class DecaySystem implements SimulationSystem {
    private componentAPI: ComponentAPI;
    private resourceAPI: ResourceAPI;
    private modifierSystem: ModifierSystem;

    /**
     * @param componentAPI - Used to read components off entities.
     * @param resourceAPI - Used to add/subtract amounts from resources.
     * @param modifierSystem - Used to resolve the effective value of baseValue after folding in every modifier.
     */
    constructor(
        componentAPI: ComponentAPI,
        resourceAPI: ResourceAPI,
        modifierSystem: ModifierSystem
    ) {
        this.componentAPI = componentAPI;
        this.resourceAPI = resourceAPI;
        this.modifierSystem = modifierSystem;
    }

    /**
     * Advances decay for every entity with a decay component,
     * subtracting rate * deltaTime from the corresponding resource.
     * Clamps at zero unless clampAtZero is explicitly set to false.
     * @param state - The game state to modify.
     * @param deltaTime - The elapsed time, in seconds, to simulate.
     */
    update(
        state: GameState,
        deltaTime: number,
    ): void {
        for (const entityId in state.entities) {
            const entity = state.entities[entityId];
            const decay = this.componentAPI.get<DecayComponent>(entity, "decay");

            if (decay === undefined) {
                continue;
            }

            const resource: string = decay.resource;
            const deltaTimeBig = BigNumber.fromNumber(deltaTime);
            const target = `decay:${resource}`;
            const effectiveRate = this.modifierSystem.getEffectiveValue(state, target, decay.rate);
            const decayAmount = effectiveRate.multiply(deltaTimeBig);
           
            const clampAtZero = decay.clampAtZero ?? true;
            const current = this.resourceAPI.get(state, resource);
            const actualDecay = clampAtZero ? decayAmount.min(current) : decayAmount;

            this.resourceAPI.add(
                state,
                resource,
                actualDecay.negate());
        }
    }
}

