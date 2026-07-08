import type { GameState } from "../core/interfaces/GameState";
import type { StorageAdapter } from "./interfaces/StorageAdapter";
import type { SaveData } from "./interfaces/SaveData";
import { Serializer } from "./Serializer";
import { SaveEncoder } from "./SaveEncoder";

/**
 * Coordinates saving and loading GameState by orchestrating the
 * Serializer, SaveEncoder, and StorageAdapter pipeline: GameState is
 * wrapped with a version, serialized to JSON, encoded into a
 * checksummed blob, and persisted (and reversed on load).
 */
export class SaveManager {
    private saveKey: string;
    private saveVersion: number;
    private serializer: Serializer;
    private encoder: SaveEncoder;
    private storage: StorageAdapter;
    
    /**
     * @param saveKey - The identifier under which saves are stored. Games
     * should choose a unique key to avoid colliding with other saves that
     * may share the same storage (e.g. other games on the same origin).
     * @param saveVersion - The save format version to stamp new saves with.
     * @param serializer - Converts GameState/SaveData to and from JSON.
     * @param encoder - Encodes/decodes JSON into a checksummed blob.
     * @param storage - Persists and retrieves the encoded blob.
     */
    constructor(saveKey: string, saveVersion: number, serializer: Serializer, encoder: SaveEncoder, storage: StorageAdapter) {
        this.saveKey = saveKey;
        this.saveVersion = saveVersion;
        this.serializer = serializer;
        this.encoder = encoder;
        this.storage = storage;
    }

    /**
     * Saves the given GameState, running it through the full
     * serialize/encode/persist pipeline.
     * @param state - The GameState to save.
     */
    save(state: GameState): void {
        const saveData: SaveData = {
            version: this.saveVersion,
            state
        };

        const json = this.serializer.serialize(saveData);
        const blob = this.encoder.encode(json);

        this.storage.write(this.saveKey, blob);
    }

    /**
     * Loads and reconstructs the previously saved GameState, if any.
     * @returns The saved GameState, or undefined if no save exists.
     * @throws Throws an error if the stored data fails checksum
     * verification, indicating corruption or tampering.
     */
    load(): GameState | undefined {
        const blob = this.storage.read(this.saveKey);
        if (blob === undefined) {
            return undefined;
        }
        return this.serializer.deserialize(this.encoder.decode(blob)).state;
    }
}