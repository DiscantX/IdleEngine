import type { GameState } from "./GameState";
import type { TimeSource } from "./TimeSource";
import { Simulation } from "./Simulation";

export class Clock {
    private simulation: Simulation;
    private lastRealTime: number;
    private timeSource: TimeSource;

    constructor(simulation: Simulation, timeSource: TimeSource){
        this.simulation = simulation
        this.timeSource = timeSource
        this.lastRealTime = this.timeSource.now()
    }

    advance(state: GameState, seconds: number): void{
        this.simulation.update(state, seconds)
    }
    advanceOffline(state: GameState, maxElapsedSeconds: number = Infinity): void {
        const now = this.timeSource.now()
        const elapsed = Math.max(0, now - this.lastRealTime);
        const elapsedSeconds = Math.min(elapsed/1000, maxElapsedSeconds)
        this.lastRealTime = now;
        this.advance(state, elapsedSeconds)
    }
}