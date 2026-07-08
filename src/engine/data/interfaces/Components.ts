import type { BigNumber } from "../../values/BigNumber";

/**
 * Marks an entity as producing a resource over time. Read by
 * ProductionSystem, which adds rate * deltaTime to the named
 * resource each tick.
 */
export interface ProductionComponent {
    /** The resource ID this entity produces. */
    resource: string;
    /** The amount of the resource produced per second. */
    rate: BigNumber;
}

/**
 * Marks an entity as decaying a resource over time. Read by
 * DecaySystem, which subtracts rate * deltaTime from the named
 * resource each tick.
 */
export interface DecayComponent {
    /** The resource ID this entity decays. */
    resource: string;
    /** The amount of the resource lost per second. */
    rate: BigNumber;
    /**
     * Whether the resource should be prevented from going below zero.
     * Defaults to true if omitted.
     */
    clampAtZero?: boolean;
}