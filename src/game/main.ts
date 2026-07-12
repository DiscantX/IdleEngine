import { createGame } from "./GameSetup";
import { setupUI, render } from "./ui/UI";
import "./ui/style.css";

const container = document.getElementById("app");
if (container === null) {
    throw new Error("Could not find #app container element.");
}

const engine = createGame();
const refs = setupUI(engine, container);
const tickIntervalSeconds = 1;

function gameLoop(): void {
    engine.tick(tickIntervalSeconds);
    render(engine, refs);
}

setInterval(gameLoop, tickIntervalSeconds * 1000);