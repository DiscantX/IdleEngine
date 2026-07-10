import type { BigNumber } from "./BigNumber";

/**
 * A function that computes a value at a given level. Used for content
 * that scales — such as upgrade costs or effect magnitudes — without
 * hardcoding the scaling curve into the engine.
 * @param level - The level to compute the value for.
 * @returns The computed value at that level, as either a plain number or a BigNumber. */
export type Formula = (level: number) => number | BigNumber;