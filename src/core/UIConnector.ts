import { setTimeout } from "node:timers/promises";
import type { CanvasRenderingContext2D, Canvas as CanvasType } from "canvas";
import Canvas from "canvas";
import sdl, { Sdl } from "@kmamal/sdl";
import { UIObject } from "../ui/UIObject";
import { Dispatcher } from "./Dispatcher";

type TreeNode = {
  id: string;
  children: TreeNode[];
};

export class UIConnector {
  uiObjects: UIObject[] = [];
  forest: TreeNode[] = [];
  objectMap = new Map<string, UIObject>()

  window: Sdl.Video.Window;
  canvas: CanvasType;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  dispatcher: Dispatcher;

  constructor() {
    this.window = sdl.video.createWindow({ title: 'EVP', width: 1280, height: 1024 });
    this.width = this.window.width;
    this.height = this.window.height;

    this.canvas = Canvas.createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext("2d");

    this.dispatcher = new Dispatcher(this);
  }

  registerUIObject(object: UIObject): void {
    this.uiObjects = [...this.uiObjects, ...this.flatUiObjectAndChildren(object)];
    this.buildGraph();
  }

  async loop(): Promise<void> {
    while (!this.window.destroyed) {
      this.ctx.closePath();
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.forest.forEach((tree) => {
        const uiObject = this.objectMap.get(tree.id);
        uiObject?.draw();
      });

      const pixelBuffer = this.canvas.toBuffer('raw')
      this.window.render(this.width, this.height, this.width * 4, 'bgra32', pixelBuffer);
      await setTimeout(0);
    }
  }

  flatUiObjectAndChildren(object: UIObject): UIObject[] {
    let result: UIObject[] = [object];

    if (object.children.length) {
      object.children.forEach((nestedObject) => {
        result = [...result, ...this.flatUiObjectAndChildren(nestedObject)];
      });
    }

    return result;
  }

  buildGraph() {
    this.objectMap = new Map<string, UIObject>();
    const hasParent = new Set<string>();

    this.uiObjects.forEach((obj) => {
      this.objectMap.set(obj.id, obj);
    });

    function buildTree(node: UIObject): TreeNode {
      return {
        id: node.id,
        children: node.children.map(buildTree),
      };
    }

    const forest: TreeNode[] = [];

    this.uiObjects.forEach((obj) => {
      obj.children.forEach((child) => {
        hasParent.add(child.id);
      });
    });

    this.uiObjects.forEach((obj) => {
      if (!hasParent.has(obj.id)) {
        forest.push(buildTree(obj));
      }
    });

    this.forest = forest;
  }
}
