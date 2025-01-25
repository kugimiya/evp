import { LinkedEntity } from "../../Interfaces/LinkedEntity";
import { GateObjectShape } from "../../Shapes/GateObjectShape";
import { LinkedObjectsStoreShape } from "../../Shapes/LinkedObjectsStoreShape";
import { GateAndEntity } from "../GateEntities/GateAndEntity";
import { GateConstEntity } from "../GateEntities/GateConstEntity";
import { GateNorEntity } from "../GateEntities/GateNorEntity";
import { GateNotEntity } from "../GateEntities/GateNotEntity";
import { GateOrEntity } from "../GateEntities/GateOrEntity";
import { GatePortEntity } from "../GateEntities/GatePortEntity";
import { GateWireEntity } from "../GateEntities/GateWireEntity";

export const GATE_LABELS = {
  AND: 'AND',
  CONST: 'CONST',
  NOR: 'NOR',
  NOT: 'NOT',
  OR: 'OR',
  PORT: 'PORT',
  WIRE: 'WIRE'
};

export class GateObjectsStore extends LinkedObjectsStoreShape {
  tick(mode: 'BFS' | 'DFS' = 'BFS') {
    if (mode === 'BFS') {
      this.traverseBFS((entity) => {
        if (entity) {
          if ((entity as GateObjectShape).action) {
            (entity as GateObjectShape).action();
          }
        }
      });
    }

    if (mode === 'DFS') {
      this.traverseDFS((entity) => {
        if (entity) {
          if ((entity as GateObjectShape).action) {
            (entity as GateObjectShape).action();
          }
        }
      });
    }
  }

  createAndEntity() {
    const gate = new GateAndEntity(this.getRandomId(GATE_LABELS.AND), this, GATE_LABELS.AND);
    return this.linkAbstractGate(gate, ['AND_A', 'AND_B'], ['AND_C']);
  }

  createConstEntity() {
    const gate = new GateConstEntity(this.getRandomId(GATE_LABELS.CONST), this, GATE_LABELS.CONST);
    return this.linkAbstractGate(gate, [], ['CONST_B']);
  }

  createNorEntity() {
    const gate = new GateNorEntity(this.getRandomId(GATE_LABELS.NOR), this, GATE_LABELS.NOR);
    return this.linkAbstractGate(gate, ['NOR_A', 'NOR_B'], ['NOR_C']);
  }

  createNotEntity() {
    const gate = new GateNotEntity(this.getRandomId(GATE_LABELS.NOT), this, GATE_LABELS.NOT);
    return this.linkAbstractGate(gate, ['NOT_A'], ['NOT_B']);
  }

  createOrEntity() {
    const gate = new GateOrEntity(this.getRandomId(GATE_LABELS.OR), this, GATE_LABELS.OR);
    return this.linkAbstractGate(gate, ['OR_A', 'OR_B'], ['OR_C']);
  }

  createWireEntity() {
    const gate = new GateWireEntity(this.getRandomId(GATE_LABELS.WIRE), this, GATE_LABELS.WIRE);
    return this.linkAbstractGate(gate, ['WIRE_A'], ['WIRE_B']);
  }

  createPortEntity(label: string) {
    const port = new GatePortEntity(this.getRandomId(`${GATE_LABELS.PORT}_${label}`), this, `${label}-${GATE_LABELS.PORT}`);
    this.objects.push(port);
    return port;
  }

  private linkAbstractGate<T extends LinkedEntity>(gate: T, inPortsLabels: string[], outPortsLabels: string[]): [T, GatePortEntity[], GatePortEntity[]] {
    this.objects.push(gate);

    const inPorts = inPortsLabels.map((label) => this.createPortEntity(label));
    const outPorts = outPortsLabels.map((label) => this.createPortEntity(label));

    gate.appendChildren(outPorts);
    inPorts.forEach((port) => port.appendChildren([gate]));

    this.rebuildTree();
    return [gate, inPorts, outPorts];
  }
}
