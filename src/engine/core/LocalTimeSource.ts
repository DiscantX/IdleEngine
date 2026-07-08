import type {TimeSource} from "./interfaces/TimeSource"

/**
 * TimeSource implementation backed by the local system clock.
 */
export class LocalTimeSource implements TimeSource {
    /**
     * @returns The current local time, in milliseconds since the Unix epoch.
     */
    now(): number {
        return Date.now();
    }
}