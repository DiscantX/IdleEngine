import type { GameState } from "./GameState";
import { Simulation } from "./Simulation";


export class Engine {

    public state: GameState;

    private simulation: Simulation;


    constructor(
        state: GameState,
        simulation: Simulation
    ) {
        this.state = state;
        this.simulation = simulation;
    }


    tick(seconds: number): void {

        this.simulation.update(
            this.state,
            seconds
        );
    }
}