import { setTimeout } from "node:timers/promises";

import { GateObjectsStore } from "./Stores/GateObjectsStore";
import { UIObjectsStore } from "./Stores/UIObjectsStore";
import { UIManager } from "./Managers/UIManager";
import { UIEventsManager } from "./Managers/UIEventsManager";

export class Kernel {
  uiManager: UIManager;
  uiEventsManager: UIEventsManager;
  gateObjectsStore: GateObjectsStore;
  uiObjectsStore: UIObjectsStore;

  constructor(uiManagerParams: ConstructorParameters<typeof UIManager>) {
    this.uiManager = new UIManager(...uiManagerParams);
    this.gateObjectsStore = new GateObjectsStore();
    this.uiObjectsStore = new UIObjectsStore(this.uiManager.ctx);
    this.uiEventsManager = new UIEventsManager(this.uiManager, this.uiObjectsStore);
  }

  async loop() {
    const simTicksPerSecond = 20;
    const intervalPointer = setInterval(() => {
      this.gateObjectsStore.tick();
    }, Math.round(1000 / simTicksPerSecond));

    while (!this.uiManager.window.destroyed) {
      try {
        if (!this.uiEventsManager.shouldFireEvents) {
          this.uiObjectsStore.rebuildTree();
          await setTimeout(100);
          this.uiEventsManager.shouldFireEvents = true;
        } else {
          this.uiManager.draw(this.uiObjectsStore);
        }
        await setTimeout(0);
      } catch (e) {
        console.error(e);
      }
    }

    clearInterval(intervalPointer);
  }
}
