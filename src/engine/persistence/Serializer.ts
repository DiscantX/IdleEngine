import { BigNumber} from "../values/BigNumber";
import type { SaveData } from "./interfaces/SaveData";

/**
 * Converts SaveData to and from JSON strings for persistence.
 * Handles restoring types that don't survive plain JSON.stringify/parse
 * on their own — such as BigNumber instances anywhere in the state tree —
 * by tagging them during serialization and reconstructing them on load.
 */
export class Serializer {
    /**
     * JSON.stringify replacer that tags BigNumber instances so they can
     * be restored on load. Non-BigNumber values pass through unchanged.
     * @param _key - The current key being processed (unused).
     * @param value - The current value being processed.
     * @returns A tagged plain object for BigNumber values, otherwise the
     * original value.
     */
    private replacer(_key: string, value: unknown): unknown {
        return value instanceof BigNumber ? { __type: "BigNumber", value: value.toString()} : value;
    }

    /**
     * JSON.parse reviver that restores tagged BigNumber objects back into
     * real BigNumber instances. Non-tagged values pass through unchanged.
     * @param _key - The current key being processed (unused).
     * @param value - The current value being processed.
     * @returns A BigNumber instance for tagged BigNumber objects, otherwise
     * the original value.
     */
    private reviver(_key: string, value: unknown): unknown {
        if (
            value !== null &&
            typeof value === "object" &&
            "__type" in value &&
            "value" in value &&
            value.__type === "BigNumber"
        ) {
            return BigNumber.fromString(value.value as string);
        }
        return value;
    }

    /**
     * Converts live GameState data into a JSON string.
     * @param saveData - Pre-serialized GameState data with version
     * @returns JSON-safe string containing the saveData
     */
    serialize(saveData: SaveData): string {
        return JSON.stringify(saveData, this.replacer);
    }

    /**
     * Converts a JSON string back into GameState data.
     * @param json - JSON string representation of GameState data
     * @returns SaveData object containing GameState information
     */ 
    deserialize(json: string): SaveData {
        return JSON.parse(json, this.reviver) as SaveData;
    }
}