import type { Value } from "../values/Value";

/**
 * Shared minimal contract for all static content
 */
export interface Definition {
    /** A unique id for the piece of content. */
    id: string;
    /** Human readable name for the piece of content. */
    name: string;
    /** Human readable description of the piece of content. */
    description?: string;
}

/**
 * The type of operation the modifier applies. Must be a string with one of the following values:
 * - "add" — Added directly to the base value.
 * - "multiplyAdditive" — Multiple modifiers of this kind sum together into one combined percentage bonus (e.g. two +10% upgrades → +20% total), applied once at the end. Use this for "stacks additively" bonuses — the common case.
 * - "multiplyCompound" — Each modifier is applied as its own independent multiplier against the running total, compounding with every other multiplyCompound modifier (e.g. two ×1.1 upgrades → ×1.21 total). Use this when each purchase should compound on top of prior purchases of the same kind, rather than blend into a shared bonus pool.
 */
export type ModifierOperation = "add" | "multiplyAdditive" | "multiplyCompound";

/**
 * Contract for definitions of the modifier. Requires:
 * - target (string): Key defined by the game that systems query against to find modifers that apply to them.
 * - operation (ModifierOperation): The type of operation the modifier applies. See ModifierOperation docs for details of each operation.
 * - magnitude (Value): The size of the modifier. Must be a value so the modifier's strength can itself scale with the upgrade's level.
 * - -  e.g. "+5% per level," by using `Value.fromFormula()`.
 */
export interface ModifierDefinition {
    target: string;
    operation: ModifierOperation;
    magnitude: Value;
}

/**
 * Contract for definitions of a resource that will be spent on a purchase. Requires:
 * - resource (string): Key representing the name or unique ID of the resource that will be spent.
 * - amount (Value): The amount of the resource required for the purchase. Must be a Value so the resource cost can itself scale with the upgrade's level.
 */
export interface ResourceCost {
    resource: string;
    amount: Value;
}

/**
 * Shared contract for content that can be acquired by spending
 * resources: upgrades, producers, and (now) entity-spawning content.
 * Consumed by the standalone purchase-evaluation logic, which checks
 * affordability and cap status identically regardless of what kind
 * of content is being purchased or what acquiring it actually does.
 */
export interface Purchasable {
    /** A list of resources and their costs, required and spent upon each acquisition. */
    costs: ResourceCost[];
    /**
     * The maximum number of times this content can be acquired.
     * When not declared, maxCount is undefined, and is treated as infinite.
     */
    maxCount?: number;
}

/**
 * Contract for definitions of upgrades. Requires:
 * - modifiers (ModifierDefinition[]): A flat list of modifiers to be applied to the upgrade. Each modifier is applied to every upgrade level.
 *
 * costs and maxCount (the cap on levels purchasable) come from Purchasable.
 */
export interface UpgradeDefinition extends Definition, Purchasable {
    modifiers: ModifierDefinition[];
}

/**
 * Contract for definitions of entities placeable in the game world.
 * Unlike UpgradeDefinition/ProducerDefinition, each acquisition spawns
 * a distinct Entity in GameState.entities — entities have individual
 * ("qualitative") identity, so owning several is represented as
 * multiple separate entities, not a shared count.
 * - components ([componentType:string]) - A bag of components (keyed by component type, e.g. production or decay) this entity's instances are created with.
 *
 * costs and maxCount (the cap on entities purchasable from this definition) come from Purchasable.
 */
export interface EntityDefinition extends Definition, Purchasable {
    components: {
        [componentType: string]: object;
    };
}

/**
 * Contract for definitions of producers: purchasable, quantity-based
 * content that generates a resource over time. Unlike EntityDefinition,
 * producers have no individual identity — owning several is represented
 * as a single count against this definition, not as separate entities.
 * - resource (string): The resource this producer generates.
 * - rate (Value): The amount generated per second, per unit owned.
 * Scales via Value so rate can grow with quantity owned (e.g. later
 * units cost more but also produce proportionally more).
 *
 * costs and maxCount (the cap on units purchasable) come from Purchasable.
 */
export interface ProducerDefinition extends Definition, Purchasable {
    resource: string;
    rate: Value;
}