import { UIObject } from "../../ui/UIObject";
import { IObject, ObjectId } from "../Interfaces/IObject";
import { Coord } from "../Typings/Coord";
import { Port } from "../Typings/Port";
import { Linker } from "./Linker";

export class BaseObject implements IObject {
  linker: Linker;
  id: ObjectId;
  coords: Coord[] = [];
  inPorts: Port[] = [];
  outPorts: Port[] = [];
  uiObject: UIObject;

  constructor(id: string, linker: Linker, uiObject: UIObject) {
    this.id = id;
    this.uiObject = uiObject;
    this.linker = linker;
    this.linker.registerObject(id, this);
  }

  action(): void {
    throw new Error("Action missed!");
  }
}
