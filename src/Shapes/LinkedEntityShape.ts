import { LinkedEntity } from "../Interfaces/LinkedEntity";
import { LinkedObjectsStoreShape } from "./LinkedObjectsStoreShape";

export class LinkedEntityShape implements LinkedEntity {
  constructor(
    public id: string,
    public objectsStore: LinkedObjectsStoreShape,
  ) { }

  childrenIds: string[] = [];

  appendChildren(children: LinkedEntity[]): void {
    this.childrenIds = [...this.childrenIds, ...children.map(child => child.id)];
    this.objectsStore.rebuildTree();
  }
}
