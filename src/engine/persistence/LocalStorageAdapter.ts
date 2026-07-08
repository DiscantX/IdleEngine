import type { StorageAdapter } from "./interfaces/StorageAdapter";

/**
 * Web browser implementation for saving, loading, and removing data
 * from the browser's localStorage.
 */
export class LocalStorageAdapter implements StorageAdapter {
    /**
     * Writes data to localStorage.
     * @param key - Unique string used by localStorage to identify the saved data.
     * @param data - String containing the data to store in localStorage.
     */
    write(key: string, data: string): void {
        localStorage.setItem(key, data);
    }

    /**
     * Reads data from localStorage.
     * @param key - Unique string used by localStorage to identify the saved data.
     * @returns The stored data, or undefined if nothing exists for that key.
     */
    read(key: string): string | undefined {
        return localStorage.getItem(key) ?? undefined;
    }

    /**
     * Removes data from localStorage.
     * @param key - Unique string used by localStorage to identify the saved data.
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    }
}