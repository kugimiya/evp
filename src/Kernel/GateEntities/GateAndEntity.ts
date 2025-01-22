import { GateObjectShape } from "../../Shapes/GateObjectShape";
import { GateObjectsStore } from "../Stores/GateObjectsStore";

export class GateAndEntity extends GateObjectShape {
  constructor(id: string, objectsStore: GateObjectsStore, label: string) {
    super(id, objectsStore, label);
  }

  action(): boolean {
    const prevValue = this.value;
    const [inPorts] = this.getPorts();

    if (inPorts.length) {
      const [_A, portAValue] = inPorts[0];
      const [_B, portBValue] = inPorts[1];

      this.value = (portAValue || 0) + (portBValue || 0) > 1 ? 1 : 0;
    }

    if (this.onGateAction) {
      this.onGateAction(this.value);
    }

    return prevValue !== this.value;
  }
}
