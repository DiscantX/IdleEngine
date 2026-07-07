import type { GameState } from "./GameState";
import { Clock } from "./Clock";

export class Engine {
    public state: GameState;
    private clock: Clock;

    constructor(state: GameState, clock: Clock) {
        this.state = state;
        this.clock = clock;
    }

    tick(seconds: number): void {
        this.clock.advance(this.state, seconds);
    }
}