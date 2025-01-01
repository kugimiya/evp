import { Coord } from "../Typings/Coord";
import { Port } from "../Typings/Port";

export interface IObject {
  id: string;
  coords: Coord[];
  inPorts: Port[];
  outPorts: Port[];
  action(): void;
}

export type ObjectId = IObject["id"];
