import { createGame } from "./game/GameSetup";

// Game A: Advance tick x100 1 time
const gameA = createGame(); 
gameA.tick(100);
console.log(gameA.state);

// Game B: Advance tick x10 10 times
const gameB = createGame(); 
for (let i = 0; i < 10; i++ ){
    gameB.tick(10);
}
console.log(gameB.state);

// Game C: Load offline progress
const gameC = createGame(); 
await new Promise(resolve => setTimeout(resolve, 2000)); //wait 2 seconds
gameC.loadOffline(1.1);
console.log(gameC.state);

// Game D: Save GameData
const gameD = createGame();
gameD.tick(10000)
gameD.save();
console.log(gameD.state);

// Game E: Load GameData
const gameE = createGame();
gameE.load();
console.log(gameE.state);
