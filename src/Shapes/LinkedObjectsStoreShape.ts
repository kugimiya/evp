import crypto from "crypto";

import { LinkedEntity } from "../Interfaces/LinkedEntity";
import { TreeNode } from "../Typings/ObjectsStore";

type GetSubTreeResult = undefined | {
  parents: LinkedEntity[] | undefined,
  target: LinkedEntity | undefined,
  children: LinkedEntity[] | undefined,
  siblings: LinkedEntity[] | undefined,
};

export class LinkedObjectsStoreShape {
  objects: LinkedEntity[] = [];
  objectsMap: Map<LinkedEntity['id'], LinkedEntity> = new Map();
  objectsParentMap: Map<LinkedEntity['id'], Set<string>> = new Map();
  forest: TreeNode[] = [];

  deleteObjects(objectIds: LinkedEntity['id'][]): void {
    this.objects = this.objects
      .filter((obj) => !objectIds.includes(obj.id))
      .map((obj) => {
        obj.childrenIds = obj.childrenIds.filter((childId) => !objectIds.includes(childId));
        return obj;
      });

    this.rebuildTree();
  }

  rebuildTree(): void {
    const self = this;
    const hasParent = new Set<string>();

    // make map
    this.objectsMap = new Map<LinkedEntity['id'], LinkedEntity>();
    this.objects.forEach((obj) => {
      this.objectsMap.set(obj.id, obj);
    });

    // make parent map
    this.objectsParentMap = new Map<LinkedEntity['id'], Set<string>>();
    this.objects.forEach((obj) => {
      if (!obj.childrenIds.length) {
        return;
      }

      obj.childrenIds.forEach((childId) => {
        if (!this.objectsParentMap.has(childId)) {
          this.objectsParentMap.set(childId, new Set<string>());
        }

        this.objectsParentMap.get(childId)?.add(obj.id);
      });
    });

    // make tree
    function buildTree(node: LinkedEntity, visited = new Set<string>()): TreeNode | null {
      if (visited.has(node.id)) {
        return null;
      }

      visited.add(node.id);
      const treeNode: TreeNode = {
        id: node.id,
        children: node.childrenIds
          .map((childrenId) => self.objectsMap.get(childrenId))
          .filter(Boolean)
          .map((children) => buildTree(children as LinkedEntity, visited))
          .filter(Boolean) as TreeNode[], // Убираем null из результата
      };

      visited.delete(node.id);
      return treeNode;
    }

    const forest: TreeNode[] = [];

    this.objectsMap.forEach((obj) => {
      obj.childrenIds.forEach((child) => {
        hasParent.add(child);
      });
    });

    this.objectsMap.forEach((obj) => {
      if (!hasParent.has(obj.id)) {
        forest.push(buildTree(obj)!);
      }
    });

    this.forest = forest;
  }

  getParents(objectId: string): string[] {
    const self = this;
    const result: string[] = [];
    const visited: Set<string> = new Set();

    function collectParents(currentId: string): void {
      if (visited.has(currentId)) {
        return;
      }

      visited.add(currentId);
      result.push(currentId);

      const parents = [...(self.objectsParentMap.get(currentId) || [])];
      parents.forEach(collectParents.bind(self));
    }

    collectParents.call(this, objectId);

    return result;
  }

  getSubTree(objectId: string, subTree?: TreeNode[]): GetSubTreeResult {
    const self = this;

    function findNodeAndBuildResult(nodes: TreeNode[]): GetSubTreeResult | undefined {
      const queue: TreeNode[] = [...nodes];

      while (queue.length > 0) {
        const currentNode = queue.shift()!;

        if (currentNode.id === objectId) {
          const parents = [...self.objectsParentMap.get(currentNode.id) || []]
            .map((parentId) => self.objectsMap.get(parentId))
            .filter(Boolean) as LinkedEntity[];

          const target = self.objectsMap.get(currentNode.id);

          const children = currentNode.children
            .map((childNode) => self.objectsMap.get(childNode.id))
            .filter(Boolean) as LinkedEntity[];

          const siblings = parents.flatMap((parent) =>
            parent.childrenIds
              .map((childId) => self.objectsMap.get(childId))
              .filter((sibling) => sibling && sibling.id !== objectId) as LinkedEntity[]
          );

          return { parents, target, children, siblings };
        }

        queue.push(...currentNode.children);
      }

      return undefined;
    }

    return (
      findNodeAndBuildResult(subTree || this.forest) || {
        parents: undefined,
        target: undefined,
        children: undefined,
        siblings: undefined,
      }
    );
  }

  traverseDFS(callback: (entity: LinkedEntity | undefined, node: TreeNode) => void, subTree?: TreeNode[]): void {
    const self = this;

    function traverseNode(node: TreeNode): void {
      if (callback) {
        const obj = self.objectsMap.get(node.id);
        if (obj) {
          callback(obj, node);
        }
      }
      node.children.forEach(traverseNode);
    }

    (subTree || self.forest).forEach(traverseNode);
  }

  traverseBFS(callback: (entity: LinkedEntity | undefined, node: TreeNode) => void, subTree?: TreeNode[]): void {
    const self = this;
    const nodesToVisit = [...(subTree || self.forest)];

    while (nodesToVisit.length > 0) {
      const currentNode = nodesToVisit.shift()!;
      if (callback) {
        const obj = self.objectsMap.get(currentNode.id);
        if (obj) {
          callback(obj, currentNode);
        }
      }
      nodesToVisit.push(...currentNode.children);
    }
  }

  getRandomId(prefix: string) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
}
