import { GateObjectShape } from "../../Shapes/GateObjectShape";
import { GateObjectsStore } from "../Stores/GateObjectsStore";

export class GatePortEntity extends GateObjectShape {
  constructor(id: string, objectsStore: GateObjectsStore, label: string) {
    super(id, objectsStore, label);
  }

  action(): boolean {
    const prevValue = this.value;
    const [inPorts] = this.getPorts();

    if (inPorts.length) {
      this.value = Math.max(...inPorts.map(([_, value]) => value || 0));
    }

    if (this.onGateAction) {
      this.onGateAction(this.value);
    }

    return prevValue !== this.value;
  }
}
