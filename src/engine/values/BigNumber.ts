/**
 * An immutable arbitrary-magnitude number, represented internally as a
 * normalized mantissa and exponent (mantissa * 10^exponent), with the
 * mantissa kept in the range 1 <= |mantissa| < 10 (or exactly 0 for zero).
 *
 * All arithmetic operations return new instances rather than mutating
 * the receiver. Precision is limited to what a JS number's mantissa can
 * hold (~15-17 significant digits); magnitude is effectively unbounded.
 */
export class BigNumber {
    private mantissa: number;
    private exponent: number;

    /**
     * Constructs a normalized BigNumber from a raw mantissa and exponent.
     * @param mantissa - The mantissa. Does not need to be pre-normalized.
     * @param exponent - The exponent. Does not need to be pre-normalized.
     */
    constructor(mantissa: number, exponent: number){
        this.mantissa = mantissa;
        this.exponent = exponent;
        this.normalize();
    }

    /**
     * Normalizes this BigNumber in place so that its mantissa is either
     * exactly 0 (with exponent 0) or satisfies 1 <= |mantissa| < 10.
     */
    private normalize(): void{
        if (this.mantissa == 0){
            this.exponent = 0;
            return;
        }

        while (Math.abs(this.mantissa) >= 10) {
            this.mantissa /= 10;
            this.exponent += 1;
        }

        while (Math.abs(this.mantissa) < 1) {
            this.mantissa *= 10;
            this.exponent -= 1;
        }
    }

    /**
     * Creates a BigNumber from a plain JS number.
     * @param value - The number to convert.
     * @returns A new normalized BigNumber representing the same value.
     */
    static fromNumber(value: number): BigNumber {
        if (value === 0){
            return new BigNumber(0, 0)
        }
        const exponent = Math.floor(Math.log10(Math.abs(value)))
        const mantissa = value / Math.pow(10, exponent)

        return new BigNumber(mantissa, exponent)
    }

    /**
     * Converts this BigNumber to a plain JS number.
     * Lossy or overflows to Infinity for magnitudes a number can't represent.
     * @returns The value as a plain number.
     */
    toNumber(): number {
        return this.mantissa * Math.pow(10, this.exponent)
    }

    /**
     * A BigNumber constant representing zero.
     */
    static readonly ZERO: BigNumber = new BigNumber(0, 0);

    /**
     * Parses a BigNumber from a string in scientific notation (e.g. "2.91e19").
     * @param value - The string to parse.
     * @returns A new BigNumber.
     */
    static fromString(value: string): BigNumber {
        const [mantissaText, exponentText = "0"] = value.split("e");
        const mantissa = Number(mantissaText);
        const exponent = Number(exponentText);

        if (Number.isNaN(mantissa) || Number.isNaN(exponent)) {
            throw new Error(`Invalid BigNumber string: "${value}"`);
        }

        return new BigNumber(mantissa, exponent);
    }

    /**
     * Converts this BigNumber to a string in scientific notation.
     * @returns A string like "2.91e19".
     */
    toString(): string {
        return `${this.mantissa}e${this.exponent}`
    }

    /**
     * Converts a number to BigNumber. If number is already a 
     * BigNumber, no conversion is needed.
     * @param value - Either a regular JavaScript number, or a BigNumber
     * @returns BigNumber represenation of the number passed in.
     */
    static from(value: number | BigNumber): BigNumber {
        if (value instanceof BigNumber){
            return value;
        }
        return BigNumber.fromNumber(value);
    }

    get significand(): number { return this.mantissa; }
    get magnitude(): number { return this.exponent; }

/* 
    ====================== 
    Equality operators
    ====================== 
*/
    /**
     * Checks whether this BigNumber represents the same value as another.
     * @param other - The BigNumber to compare against.
     * @returns True if both represent the same value.
     */
    equals(other: BigNumber): boolean {
        return this.mantissa === other.mantissa && this.exponent === other.exponent;
    } 

    /**
     * Checks whether this BigNumber is less than another.
     * @param other - The BigNumber to compare against.
     * @returns True if this value is less than other.
     */
    lessThan(other: BigNumber): boolean {
        if (this.equals(other)) {
            return false;
        }

        const thisRank = Math.sign(this.mantissa) * (this.exponent + 1);
        const otherRank = Math.sign(other.mantissa) * (other.exponent + 1);

        if (thisRank !== otherRank) {
            return thisRank < otherRank;
        }

        return this.mantissa < other.mantissa;
    }

    /**
     * Checks whether this BigNumber is greater than another.
     * @param other - The BigNumber to compare against.
     * @returns True if this value is greater than other.
     */
    greaterThan(other: BigNumber): boolean {
       return !this.lessThan(other) && !this.equals(other);
    }

    /**
     * Checks whether this BigNumber is less than or equal to another.
     * @param other - The BigNumber to compare against.
     * @returns True if this value is less than or equal to other.
     */
    lessThanOrEqual(other: BigNumber): boolean {
       return this.lessThan(other) || this.equals(other) ;
    }

    /**
     * Checks whether this BigNumber is greater than or equal to another.
     * @param other - The BigNumber to compare against.
     * @returns True if this value is greater than or equal to other.
     */
    greaterThanOrEqual(other: BigNumber): boolean {
       return this.greaterThan(other) || this.equals(other) ;
    }

    /**
     * Returns the smaller of this BigNumber and another.
     * @param other - The BigNumber to compare against.
     * @returns This BigNumber, or other, whichever is smaller.
     */
    min(other: BigNumber): BigNumber {
        return this.lessThanOrEqual(other) ? this : other;
    }

    /**
     * Returns the larger of this BigNumber and another.
     * @param other - The BigNumber to compare against.
     * @returns This BigNumber, or other, whichever is larger.
     */
    max(other: BigNumber): BigNumber {
        return this.greaterThanOrEqual(other) ? this : other;
    }

/* 
    ====================== 
    Arithmetic operators
    ====================== 
*/  
    /**
     * Inverts this BigNumber's sign.
     * @returns A new BigNumber with the sign inverted.
     */
    negate(): BigNumber{
        return new BigNumber(-this.mantissa, this.exponent)
    }

    /**
     * Sums two BigNumbers together.
     * 
     * @param other - The other number to be added to this number.
     * @returns A new BigNumber that is the sum of this and other.
     */
    add(other: BigNumber): BigNumber {
        // Separate the two BigNumbers by the size of their exponents
        const [larger, smaller] = this.exponent >= other.exponent ? [this, other] : [other, this];
        //Get the difference between the exponents
        const exponentDiff = larger.exponent - smaller.exponent;

        // Differences of exponents ~17 or over are insignificant;
        // return the largest and skip the upcoming expensive calculation
        if (exponentDiff > 17) {
            return new BigNumber(larger.mantissa, larger.exponent);
        }
        // Align the smaller exponent to the larger by shifting its mantissa right
        // by the number of powers of ten separating the two exponents. Then sum the two mantissas.
        const sumMantissa = larger.mantissa + smaller.mantissa / 10 ** exponentDiff;

        return new BigNumber(sumMantissa, larger.exponent);
    }
    /**
     * Subtracts another BigNumber from this one.
     * @param other - The BigNumber to subtract from this BigNumber.
     * @returns A new BigNumber representing the difference.
     */
    subtract(other: BigNumber): BigNumber {
        return this.add(other.negate())
    }

    /**
     * Multiplies this BigNumber by another.
     * @param other - The BigNumber to multiply by.
     * @returns A new BigNumber representing the product.
     */
    multiply(other: BigNumber): BigNumber {
        return new BigNumber((this.mantissa * other.mantissa), (this.exponent + other.exponent))
    }

    /**
     * Divides this BigNumber by another.
     * @param other - The BigNumber to divide by.
     * @returns A new BigNumber representing the quotient.
     * @throws {Error} If other is zero.
     */
    divide(other: BigNumber): BigNumber {
        if (other.mantissa === 0) {
            throw new Error("Division by zero");
        }
        return new BigNumber((this.mantissa / other.mantissa), (this.exponent - other.exponent))
    }

}