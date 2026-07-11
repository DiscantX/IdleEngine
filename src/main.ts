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
import { miningSpeed } from "./game/definitions/upgrades";
import { BigNumber } from "./engine/values/BigNumber"
// import { Value } from "./engine/values/Value"

// // Game A: advance by a single 100-second tick and confirm production applied.const gameA = createGame(); 
// const gameA = createGame(); 
// gameA.tick(100);
// console.log(gameA.state);

// // Game B: advance via ten 10-second ticks; should match Game A's result,
// // verifying that simulation is time-step-independent (deterministic).const gameB = createGame(); 
// const gameB = createGame(); 
// for (let i = 0; i < 10; i++ ){
//     gameB.tick(10);
// }
// console.log(gameB.state);

// // Game C: simulate returning after being closed for ~2 real seconds,
// // verifying offline progress advances state without manual ticking.
// const gameC = createGame(); 
// await new Promise(resolve => setTimeout(resolve, 2000)); //wait 2 seconds
// gameC.loadOffline(1.1);
// console.log(gameC.state);

// // Game D: advance and persist state via the save pipeline.
// const gameD = createGame();
// gameD.tick(10000)
// gameD.save();
// console.log(gameD.state);

// // Game E: load into a fresh instance and confirm the saved state
// // (including BigNumber values) round-trips correctly.
// const gameE = createGame();
// gameE.load();
// console.log(gameE.state);

// // Game F: production (25/sec) and decay (5/sec) both act on gold in
// // the same tick; net should be +20/sec, verifying multi-system ordering.
// const gameF = createGame();
// gameF.tick(10);
// console.log(gameF.state);

// const valueL0 = Value.constant(31.4).resolve()
// const valueL1 = Value.constant(31.4).resolve(5)
// const formula = (level: number): number => {
//     const baseMultiplier = 10
//     const growth = 1.15 ** level;
//     return baseMultiplier * growth;
// }
// const formulaV1 = Value.fromFormula(formula).resolve(0);
// const formulaV2 = Value.fromFormula(formula).resolve(5);
// const formulaV3 = Value.fromFormula(formula).resolve(10);

// console.log(valueL0);
// console.log(valueL1);
// console.log(formulaV1);
// console.log(formulaV2);
// console.log(formulaV3);

// Game G: purchase one level of miningSpeed, then tick 10 seconds.
// miningSpeed grants +10% (multiplyAdditive) to "production:gold" only.
// Expect: production 25 * 1.10 = 27.5/sec, decay unchanged at 5/sec,
// net 22.5/sec * 10s = 225 gold (vs. 200 without the upgrade, per Slice 7).
const gameG = createGame();
gameG.state.resources.gold = BigNumber.fromNumber(10);
const purchased = gameG.purchase(miningSpeed);
console.log("Purchase succeeded:", purchased);
gameG.tick(10);
console.log(gameG.state);