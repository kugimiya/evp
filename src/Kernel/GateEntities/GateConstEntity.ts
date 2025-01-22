import { GateObjectShape } from "../../Shapes/GateObjectShape";
import { GateObjectsStore } from "../Stores/GateObjectsStore";

export class GateConstEntity extends GateObjectShape {
  constructor(id: string, objectsStore: GateObjectsStore, label: string) {
    super(id, objectsStore, label);
  }

  action(): boolean {
    if (this.onGateAction) {
      this.onGateAction(this.value);
    }

    return true;
  }
}
