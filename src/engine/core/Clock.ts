import type { GameState } from "./GameState";
import { Simulation } from "./Simulation";

export class Clock {
    private simulation: Simulation;

    constructor(simulation: Simulation){
        this.simulation = simulation
    }

    advance(state: GameState, seconds: number): void{
        this.simulation.update(state, seconds)
    }

}