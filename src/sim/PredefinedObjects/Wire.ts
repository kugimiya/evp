import { UIObject } from "../../ui/UIObject";
import { BaseObject } from "../Entities/BaseObject";
import { Linker } from "../Entities/Linker";
import { Coord } from "../Typings/Coord";

export class Wire extends BaseObject {
  coords: Coord[] = [{ x: 0, y: 0 }];

  constructor(id: string, linker: Linker, uiObject: UIObject) {
    super(`WIRE-${id}`, linker, uiObject);

    this.inPorts = [[`${this.id}-A`, "A", undefined]];
    this.linker.registerInPorts(this.id, [`${this.id}-A`]);

    this.outPorts = [[`${this.id}-B`, "B", undefined]];
    this.linker.registerOutPorts(this.id, [`${this.id}-B`]);
  }

  action(): void {
    const valueForA = this.inPorts[0][2];
    this.outPorts[0][2] = valueForA;
    this.uiObject.gateState = this.outPorts[0][2];
  }
}
