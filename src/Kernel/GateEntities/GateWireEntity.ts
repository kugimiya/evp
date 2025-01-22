import { GateObjectShape } from "../../Shapes/GateObjectShape";
import { GateObjectsStore } from "../Stores/GateObjectsStore";

export class GateWireEntity extends GateObjectShape {
  constructor(id: string, objectsStore: GateObjectsStore, label: string) {
    super(id, objectsStore, label);
  }

  action(): boolean {
    const prevValue = this.value;
    const [inPorts, outPorts] = this.getPorts();

    if (inPorts.length) {
      const [_A, portAValue] = inPorts[0];

      this.value = portAValue || 0;
    }

    if (this.onGateAction) {
      this.onGateAction(this.value);
    }

    return prevValue !== this.value;
  }
}
