import { GateObjectMeta, GetPortsReturn } from "../Interfaces/GateObjectMeta";
import { LinkedEntity } from "../Interfaces/LinkedEntity";
import { GateObjectPort, GateObjectPortType } from "../Typings/GateObjectPort";
import { LinkedEntityShape } from "./LinkedEntityShape";
import { LinkedObjectsStoreShape } from "./LinkedObjectsStoreShape";

export class GateObjectShape extends LinkedEntityShape implements LinkedEntity, GateObjectMeta {
  constructor(id: string, objectsStore: LinkedObjectsStoreShape, label: string) {
    super(id, objectsStore);
    this.label = label;
  }

  // meta
  label = '';

  value: number | undefined = undefined;

  onGateAction?: (gateValue: number | undefined) => void | undefined = undefined;

  action() {
    return false;
  }

  getPorts() {
    const subTree = this.objectsStore.getSubTree(this.id);
    if (!subTree) {
      return [[], []] as GetPortsReturn;
    }

    const { parents, children } = subTree;
    return [
      [...((parents || []) as GateObjectShape[]).map((parent) => [parent.id, parent.value, GateObjectPortType.InPort] as GateObjectPort)],
      [...((children || []) as GateObjectShape[]).map((child) => [child.id, child.value, GateObjectPortType.OutPort] as GateObjectPort)],
    ] as GetPortsReturn;
  }
}
