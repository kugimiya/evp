import { ObjectId } from "../Interfaces/IObject";
import { Linker } from "./Linker";
import { And } from "../PredefinedObjects/And";
import { Const } from "../PredefinedObjects/Const";
import { Not } from "../PredefinedObjects/Not";
import { Wire } from "../PredefinedObjects/Wire";
import { NotOr } from "../PredefinedObjects/NotOr";
import { Or } from "../PredefinedObjects/Or";
import { BaseObject } from "./BaseObject";
import { UIObject } from "../../ui/UIObject";

export class Solver {
  linker: Linker;

  constructor() {
    this.linker = new Linker();
  }

  addObjectAnd(uiObject: UIObject) {
    const object = new And(this.getRandomId(), this.linker, uiObject);
    this.registerObject(object);
    return object;
  }

  addObjectConst(value: number, uiObject: UIObject) {
    const object = new Const(this.getRandomId(), this.linker, value, uiObject);
    this.registerObject(object);
    return object;
  }

  addObjectNot(uiObject: UIObject) {
    const object = new Not(this.getRandomId(), this.linker, uiObject);
    this.registerObject(object);
    return object;
  }

  addObjectNotOr(uiObject: UIObject) {
    const object = new NotOr(this.getRandomId(), this.linker, uiObject);
    this.registerObject(object);
    return object;
  }

  addObjectOr(uiObject: UIObject) {
    const object = new Or(this.getRandomId(), this.linker, uiObject);
    this.registerObject(object);
    return object;
  }

  addObjectWire(uiObject: UIObject) {
    const object = new Wire(this.getRandomId(), this.linker, uiObject);
    this.registerObject(object);
    return object;
  }

  registerObject(object: BaseObject): void {
    this.linker.registerObject(object.id, object);
    this.linker.registerInPorts(
      object.id,
      object.inPorts.map((_) => _[0]),
    );
    this.linker.registerOutPorts(
      object.id,
      object.outPorts.map((_) => _[0]),
    );
  }

  step(rootObjectId: ObjectId, deep = 0) {
    const rootObject = this.linker.objects[rootObjectId];
    rootObject.action();

    const outLinks = this.linker.findOutLinks(rootObject.id);

    console.log({ rootObjectId, deep });

    outLinks.forEach((outLink) => {
      const outObject = this.linker.objects[outLink.out.id];
      const outPort = outObject.outPorts.find(
        (port) => port[0] === outLink.out.port,
      );

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
        if (changed || deep < 10) {
          try {
            this.step(inLink.id, deep + 1);
          } catch (e) {
            console.log("SOLVER: Dead cycle detected, deep =", deep);
          }
        }
      });
    });
  }

  private getRandomId(): string {
    return `${Date.now()}`;
  }
}
