import { App } from "./App/App";

const app = new App();
app.uiBuilder.buildUI();
app.uiController.bindUIButtonsHandlers();
