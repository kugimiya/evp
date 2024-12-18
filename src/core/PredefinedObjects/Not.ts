import { BaseObject } from "../Entities/BaseObject";
import { Linker } from "../Entities/Linker";
import { Coord } from "../Typings/Coord";

export class Not extends BaseObject {
  coords: Coord[] = [
    { x: 0, y: 0 },
  ];

  constructor(id: string, linker: Linker) {
    super(`NOT-${id}`, linker);

    this.inPorts = [
      [`${this.id}-A`, 'A', undefined],
    ];
    this.linker.registerInPorts(this.id, [`${this.id}-A`, `${this.id}-B`]);

    this.outPorts = [
      [`${this.id}-B`, 'B', undefined],
    ];
    this.linker.registerOutPorts(this.id, [`${this.id}-B`]);
  }

  action(): void {
    const valueForA = this.inPorts[0][2];
    this.outPorts[0][2] = Number(!valueForA);
  }
}
