import { UIConnector } from "./core/UIConnector";
import { UIController } from "./core/UIController";
import { Solver } from "./sim/Entities/Solver";

const solver = new Solver();
const ui = new UIConnector();
const controller = new UIController(ui, solver);

controller.spawnBackground();
controller.spawnCanvas();
controller.spawnToolbar();

ui.loop();
