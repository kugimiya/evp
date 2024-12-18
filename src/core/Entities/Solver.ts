import { nanoid } from "nanoid";
import { ObjectId } from "../Interfaces/IObject";
import { And } from "../PredefinedObjects/And";
import { Const } from "../PredefinedObjects/Const";
import { Not } from "../PredefinedObjects/Not";
import { Linker } from "./Linker";

export class Solver {
  linker: Linker;

  constructor() {
    this.linker = new Linker();
  }

  addObjectConst(value: number) {
    return new Const(this.getRandomId(), this.linker, value);
  }

  addObjectAnd() {
    return new And(this.getRandomId(), this.linker);
  }

  addObjectNot() {
    return new Not(this.getRandomId(), this.linker);
  }

  step(rootObjectId: ObjectId, deep = 0) {
    const rootObject = this.linker.objects[rootObjectId];
    rootObject.action();

    const outLinks = this.linker.findOutLinks(rootObject.id);
    outLinks.forEach((outLink) => {
      const outObject = this.linker.objects[outLink.out.id];
      const outPort = outObject.outPorts.find((port) => port[0] === outLink.out.port);

      if (!outPort) {
        return;
      }

      outLink.in.forEach((inLink) => {
        const inObject = this.linker.objects[inLink.id];
        const inPort = inObject.inPorts.find((port) => port[0] === inLink.port);
        const changed = inPort![2] !== outPort[2];

        if (inPort) {
          inPort[2] = outPort[2];
        }

        // recurse it
        if (changed) {
          try {
            this.step(inLink.id, deep + 1);
          } catch (e) {
            console.log('SOLVER: Dead cycle detected, deep =', deep);
          }
        }
      });
    });
  }

  private getRandomId(): string {
    return nanoid(4);
  }
}
