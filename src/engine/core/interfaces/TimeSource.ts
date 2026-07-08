/**
 * A pluggable source of the current real-world time. Abstracts away
 * where "now" comes from (system clock, server, etc.) so offline
 * progress can be calculated against different time authorities.
 */
export interface TimeSource {
    /**
     * @returns The current time, in milliseconds since the Unix epoch.
     */
    now(): number;
};