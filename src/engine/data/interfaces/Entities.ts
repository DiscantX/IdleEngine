/**
 * A lightweight container identified by an ID and holding a bag of
 * components keyed by component type. Entities carry no behavior of
 * their own; systems process the components attached to them.
 */
export interface Entity {
    /** The entity's unique identifier. */
    id: string;

    /** Components attached to this entity, keyed by component type. */
    components: {
        [componentType: string]: object;
    };
}