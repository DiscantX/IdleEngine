import { createGame } from "./game/GameSetup";


const game = createGame();


game.tick(10);


console.log(game.state);