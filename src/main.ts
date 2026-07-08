/**
 * Manual integration test / demo script for the engine.
 *
 * Runs several independently-constructed game instances through
 * different code paths (manual ticking, offline progress, save/load)
 * to sanity-check core engine behavior end to end. Not a permanent
 * part of the example game — intended to be replaced by a real
 * automated test suite and/or a UI entry point later.
 */

import { createGame } from "./game/GameSetup";

// Game A: advance by a single 100-second tick and confirm production applied.const gameA = createGame(); 
const gameA = createGame(); 
gameA.tick(100);
console.log(gameA.state);

// Game B: advance via ten 10-second ticks; should match Game A's result,
// verifying that simulation is time-step-independent (deterministic).const gameB = createGame(); 
const gameB = createGame(); 
for (let i = 0; i < 10; i++ ){
    gameB.tick(10);
}
console.log(gameB.state);

// Game C: simulate returning after being closed for ~2 real seconds,
// verifying offline progress advances state without manual ticking.
const gameC = createGame(); 
await new Promise(resolve => setTimeout(resolve, 2000)); //wait 2 seconds
gameC.loadOffline(1.1);
console.log(gameC.state);

// Game D: advance and persist state via the save pipeline.
const gameD = createGame();
gameD.tick(10000)
gameD.save();
console.log(gameD.state);

// Game E: load into a fresh instance and confirm the saved state
// (including BigNumber values) round-trips correctly.
const gameE = createGame();
gameE.load();
console.log(gameE.state);
