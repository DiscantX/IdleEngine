import { BigNumber } from "./BigNumber";
import type { Formula } from "./Formula"

/**
 * Describes where a Value's number comes from: either a fixed
 * BigNumber, or a Formula computed against a level.
 */

type ValueSource = 
    | { kind: "constant"; value: BigNumber }
    | { kind: "formula"; formula: Formula };

/**
 * A number that is either fixed or computed from a level via a
 * Formula, exposed behind a single interface so callers never need
 * to know which. Used anywhere content needs to scale — such as
 * upgrade costs or effect magnitudes — without every consumer having
 * to branch on whether the underlying number is static or dynamic.
 */
export class Value {
    private source: ValueSource;

        /**
     * @param source - The underlying constant or formula this Value resolves from.
     */
    private constructor(source: ValueSource) {
        this.source = source;
    }

        /**
     * Creates a Value that always resolves to the same fixed amount.
     * @param value - The fixed amount.
     * @returns A new constant Value.
     */
    static constant(value: BigNumber): Value {
        return new Value ({ kind: "constant", value });
    }

    /**
     * Creates a Value that resolves by calling a Formula.
     * @param formula - The formula to compute the amount from.
     * @returns A new formula-backed Value.
     */
    static fromFormula(formula: Formula): Value {
        return new Value({ kind: "formula", formula });
    }

    /**
     * Resolves this Value to a concrete BigNumber. The level is ignored
     * for constant Values.
     * @param level - The level to resolve a formula-backed Value at.
     * @returns The resolved amount.
     */
    resolve(level: number = 0): BigNumber {
        switch (this.source.kind) {
            case "constant":
                return this.source.value;
            case "formula":
                return this.source.formula(level);
        }
    }
}   
