/**
 * A lightweight container identified by an ID and holding a bag of
 * components keyed by component type. Entities carry no behavior of
 * their own; systems process the components attached to them.
 */
export interface Entity {
    /** The entity's unique identifier. */
    id: string;

    /**
     * The id of the EntityDefinition this entity was created from, if
     * any. Lets QueryAPI count how many entities trace back to a given
     * definition (e.g. for cap-checking against Purchasable.maxCount)
     * without a separate count to keep in sync — entities remain the
     * single source of truth for their own existence.
     */
    definitionId?: string;

    /** Components attached to this entity, keyed by component type. */
    components: {
        [componentType: string]: object;
    };
}