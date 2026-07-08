/**
 * A pluggable contract for persisting and retrieving save data.
 * Implementations decide where data actually lives (browser storage,
 * filesystem, network, etc.) — this interface only describes the
 * read/write/remove operations available on top.
 */
export interface StorageAdapter {
    /**
     * Persists data under the given key, overwriting any existing value.
     * @param key - The identifier to store the data under.
     * @param data - The data to persist.
     */
    write(key: string, data: string): void;

    /**
     * Retrieves previously persisted data for a given key.
     * @param key - The identifier to look up.
     * @returns The stored data, or undefined if nothing exists for that key.
     */
    read(key: string): string | undefined;

    /**
     * Deletes any persisted data under the given key.
     * @param key - The identifier to remove.
     */
    remove(key: string): void;
}