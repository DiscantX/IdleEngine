import { createGame } from "./game/GameSetup";

const gameA = createGame();
const gameB = createGame();

gameA.tick(100);

for (let i = 0; i < 10; i++ ){
    gameB.tick(10);
}

console.log(gameA.state);
console.log(gameB.state);