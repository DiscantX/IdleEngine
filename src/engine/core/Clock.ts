import type { GameState } from "./interfaces/GameState";
import type { TimeSource } from "./interfaces/TimeSource";
import { Simulation } from "./Simulation";

/**
 * Drives simulation advancement over real time, supporting both
 * manual ticking and catching up on progress made while offline,
 * using a pluggable TimeSource as the authority on "now".
 */
export class Clock {
    private simulation: Simulation;
    private lastRealTime: number;
    private timeSource: TimeSource;

    /**
     * @param simulation - The Simulation to advance.
     * @param timeSource - Provides the current real-world time.
     */
    constructor(simulation: Simulation, timeSource: TimeSource){
        this.simulation = simulation
        this.timeSource = timeSource
        this.lastRealTime = this.timeSource.now()
    }

    /**
     * Advances the simulation by a fixed number of seconds.
     * @param state - The game state to modify.
     * @param seconds - The elapsed time, in seconds, to simulate.
     */
    advance(state: GameState, seconds: number): void{
        this.simulation.update(state, seconds)
    }

    /**
     * Advances the simulation based on real elapsed time since the
     * clock was last updated (or constructed), simulating progress made
     * while offline. Negative elapsed time is clamped to zero.
     * @param state - The game state to modify.
     * @param maxElapsedSeconds - The maximum elapsed time to simulate,
     * capping how much offline progress can be applied at once.
     */
    advanceOffline(state: GameState, maxElapsedSeconds: number = Infinity): void {
        const now = this.timeSource.now()
        const elapsed = Math.max(0, now - this.lastRealTime);
        const elapsedSeconds = Math.min(elapsed/1000, maxElapsedSeconds)
        this.lastRealTime = now;
        this.advance(state, elapsedSeconds)
    }
}