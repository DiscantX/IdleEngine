import { Clock } from "./Clock";
import type { GameState } from "./interfaces/GameState";
import type { SaveManager } from "../persistence/SaveManager";
import type { UpgradeAPI } from "../api/UpgradeAPI";
import type { ProducerAPI } from "../api/ProducerAPI";
import type { ProducerDefinition, UpgradeDefinition } from "../data/Definitions";

/**
 * The session-level facade for a running game instance. Binds a live
 * GameState to a fixed set of engine services (ie. Clock, SaveManager,
 * and content-purchase APIs) constructed alongside it, so calling
 * code can act on "the current game" through short, stateless-looking
 * calls instead of threading GameState through every API call by
 * hand. Each public method delegates to the relevant injected
 * service — Engine owns no simulation or persistence logic itself.
 */
export class Engine {
    public state: GameState;
    private clock: Clock;
    private saveManager: SaveManager;
    private upgradeAPI: UpgradeAPI;
    private producerAPI: ProducerAPI;

/**
     * @param state - The initial GameState to run the simulation on.
     * @param clock - Drives simulation advancement, online and offline.
     * @param saveManager - Handles persisting and restoring GameState.
     * @param upgradeAPI - The interface for reading upgrade levels and processing upgrade purchases.
     * @param producerAPI - The interface for reading producer quantities and processing producer purchases.
     */
    constructor(state: GameState, clock: Clock, saveManager: SaveManager, upgradeAPI: UpgradeAPI, producerAPI: ProducerAPI) {
        this.state = state;
        this.clock = clock;
        this.saveManager = saveManager;
        this.upgradeAPI = upgradeAPI;
        this.producerAPI = producerAPI;
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

    /**
     * Purchases an upgrade.
     * @param definition - The UpgradeDefinition to be purchased.
     * @returns Boolean representing the success of the transaction.
     */
    purchaseUpgrade(definition: UpgradeDefinition): boolean {
       return this.upgradeAPI.purchase(this.state, definition);
   }

    /**
     * Purchases a producer.
     * @param definition - The ProducerDefinition to be purchased.
     * @returns Boolean representing the success of the transaction.
     */
    purchaseProducer(definition: ProducerDefinition): boolean {
       return this.producerAPI.purchase(this.state, definition);
   }
}