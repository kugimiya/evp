import { IObject, ObjectId } from "../Interfaces/IObject";
import { Link } from "../Typings/Link";
import { PortId } from "../Typings/Port";

export class Linker {
  links: Link[] = [];
  inPorts: Record<ObjectId, PortId[]> = {};
  outPorts: Record<ObjectId, PortId[]> = {};
  objects: Record<ObjectId, IObject> = {};

  registerObject(id: ObjectId, newObject: IObject) {
    this.objects[id] = newObject;
  }

  registerLink(newLink: Link) {
    this.links.push(newLink);
  }

  registerInPorts(targetId: ObjectId, portIds: PortId[]) {
    this.inPorts[targetId] = portIds;
  }

  registerOutPorts(targetId: ObjectId, portIds: PortId[]) {
    this.outPorts[targetId] = portIds;
  }

  findOutLinks(targetId: ObjectId): Link[] {
    return this.links.filter((link) => link.out.id === targetId);
  }
}
