import { BaseObject } from "../Entities/BaseObject";
import { Linker } from "../Entities/Linker";
import { Coord } from "../Typings/Coord";

export class Const extends BaseObject {
  coords: Coord[] = [{ x: 0, y: 0 }];

  constructor(id: string, linker: Linker, value: number) {
    super(`CONST-${id}`, linker);

    this.inPorts = [[`${this.id}-U`, "U", value]];
    this.linker.registerInPorts(this.id, [`${this.id}-U`]);
    this.outPorts = [[`${this.id}-A`, "A", value]];
    this.linker.registerOutPorts(this.id, [`${this.id}-C`]);
  }

  action(): void {}
}
