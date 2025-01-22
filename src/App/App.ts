import { Kernel } from "../Kernel/Kernel";
import { AppUIBuilder } from "./AppUIBuilder";
import { AppUIController } from "./AppUIController";

export class App {
  kernel: Kernel;
  uiBuilder: AppUIBuilder;
  uiController: AppUIController;

  constructor() {
    this.kernel = new Kernel([1920, 1080, "Logic Gates Simulator"]);
    this.kernel.loop();

    this.uiBuilder = new AppUIBuilder(this.kernel);
    this.uiController = new AppUIController(this.uiBuilder, this, this.kernel.gateObjectsStore);
  }
}
