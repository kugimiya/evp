import { UIObject } from "../../ui/UIObject";
import { BaseObject } from "../Entities/BaseObject";
import { Linker } from "../Entities/Linker";
import { Coord } from "../Typings/Coord";

export class Or extends BaseObject {
  coords: Coord[] = [{ x: 0, y: 0 }];

  constructor(id: string, linker: Linker, uiObject: UIObject) {
    super(`OR-${id}`, linker, uiObject);

    this.inPorts = [
      [`${this.id}-A`, "A", undefined],
      [`${this.id}-B`, "B", undefined],
    ];
    this.linker.registerInPorts(this.id, [`${this.id}-A`, `${this.id}-B`]);

    this.outPorts = [[`${this.id}-C`, "C", undefined]];
    this.linker.registerOutPorts(this.id, [`${this.id}-C`]);
  }

  action(): void {
    const [valueForA, valueForB] = [this.inPorts[0][2], this.inPorts[1][2]];
    this.outPorts[0][2] = valueForA || valueForB;
    this.uiObject.gateState = this.outPorts[0][2];
  }
}
