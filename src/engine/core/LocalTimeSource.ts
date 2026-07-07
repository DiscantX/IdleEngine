import type {TimeSource} from "./interfaces/TimeSource"

export class LocalTimeSource implements TimeSource {
    now(): number {
        return Date.now();
    }
}