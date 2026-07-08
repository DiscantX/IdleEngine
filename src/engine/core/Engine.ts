import type { GameState } from "./interfaces/GameState";
import type { SaveManager } from "../persistence/SaveManager";
import { Clock } from "./Clock";

/**
 * The main entry point for driving a game instance: holds the live
 * GameState and delegates ticking, offline progress, and save/load
 * to the Clock and SaveManager it's constructed with.
 */
export class Engine {
    public state: GameState;
    private clock: Clock;
    private saveManager: SaveManager

    /**
     * @param state - The initial GameState to run the simulation on.
     * @param clock - Drives simulation advancement, online and offline.
     * @param saveManager - Handles persisting and restoring GameState.
     */
    constructor(state: GameState, clock: Clock, saveManager: SaveManager) {
        this.state = state;
        this.clock = clock;
        this.saveManager = saveManager;
    }

    /**
     * Advances the simulation by a fixed number of seconds.
     * @param seconds - The elapsed time, in seconds, to simulate.
     */
    tick(seconds: number): void {
        this.clock.advance(this.state, seconds);
    }
    
    /**
     * Advances the simulation based on real elapsed time since the
     * clock was last updated, simulating progress made while offline.
     * @param maxElapsedSeconds - The maximum elapsed time to simulate,
     * capping how much offline progress can be applied at once.
     */
    loadOffline(maxElapsedSeconds: number = Infinity): void{
        this.clock.advanceOffline(this.state, maxElapsedSeconds);
    }

    /**
     * Persists the current GameState via the SaveManager.
     */
    save(): void {
        this.saveManager.save(this.state);
    }
    
    /**
     * Restores GameState from a previous save, if one exists. Leaves
     * the current state unchanged if no save is found.
     */
    load(): void {
        const loaded = this.saveManager.load();
        if (loaded !== undefined) {
            this.state = loaded;
        }
    }
}