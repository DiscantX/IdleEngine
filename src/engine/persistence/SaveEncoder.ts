/**
 * Encodes and decodes save game data to and from a hash value.
 * Utilizes a checksum to signal data corruption or alteration.
 * Useful for safe Import/Export of game data.
 */
export class SaveEncoder {
    /**
     * Calculates a checksum using the djb2 hash function.
     * @param data - String containing the data to find the checksum of.
     * @returns The checksum as a hexadecimal string.    
     */
    private checksum(data: string): string {
        let hash = 5381;
        for (let i = 0; i < data.length; i++) {
            hash = (hash * 33) ^ data.charCodeAt(i);
        }
        return (hash >>> 0).toString(16);
    }

    /**
     * Encodes a string into a both a checksum and encoded data.
     * Useful for obfuscation and creating a safe to copy string.
     * @param json - JSON string containing the game data.
     * @returns Concatenated string containing both the checksum and the encoded data.
     */
    encode(json: string): string {
        const encoded = btoa(encodeURIComponent(json));
        const hash = this.checksum(encoded);
        return `${hash}:${encoded}`;
    }

    /**
     * Decodes a blob produced by encode() back into the original JSON string,
     * verifying the checksum first to detect corruption or tampering.
     * @param blob - Concatenated string containing both the checksum and the encoded data.
     * @returns JSON string containing the game data.
     * @throws Throws an error if checksums do not match, indicating data corruption.
     */
    decode(blob: string): string {
        const separatorIndex = blob.indexOf(":");
        const hash = blob.slice(0, separatorIndex);
        const encoded = blob.slice(separatorIndex + 1);

        if (hash !== this.checksum(encoded)){
            throw new Error("Checksums on saved data do not match. The data may be corrupted.");
        }

        return decodeURIComponent(atob(encoded));
    }

}