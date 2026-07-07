import type {TimeSource} from "./TimeSource"

export class LocalTimeSource implements TimeSource {
    now(): number {
        return Date.now();
    }
}