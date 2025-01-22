import type { CanvasRenderingContext2D, Canvas as CanvasType } from "canvas";
import Canvas from "canvas";
import sdl, { Sdl } from "@kmamal/sdl";

import { UIObjectsStore } from "../Stores/UIObjectsStore";
import { UIObjectShape } from "../../Shapes/UIObjectShape";
import { UIObjectLayout, UIObjectPosition } from "../../Typings/UIObject";

export class UIManager {
  window: Sdl.Video.Window;
  canvas: CanvasType;
  ctx: CanvasRenderingContext2D;

  constructor(public width = 1024, public height = 768, public windowTitle = 'EVP') {
    this.window = sdl.video.createWindow({ title: windowTitle, width, height });
    this.canvas = Canvas.createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d");
  }

  public draw(uiObjectsStore: UIObjectsStore) {
    this.clearCanvas();
    this.composeLayouts(uiObjectsStore);
    this.renderUIObjects(uiObjectsStore);
    this.renderSDL();
  }

  private clearCanvas() {
    this.ctx.closePath();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private composeLayouts(uiObjectsStore: UIObjectsStore) {
    uiObjectsStore.traverseDFS((uiObject) => {
      if (!uiObject) {
        return;
      }

      const target = uiObject as UIObjectShape;
      const subTree = uiObjectsStore.getSubTree(target.id);
      const childrenUncasted = subTree?.children || [];
      const [parentUncasted] = subTree?.parents || [];

      if (childrenUncasted) {
        const children = childrenUncasted as UIObjectShape[];

        let prevX = target.x + target.offsetX + target.paddingX;
        let prevY = target.y + target.offsetY + target.paddingY;

        if (target.layout === UIObjectLayout.FlexHorizontal) {
          children.forEach((child, childIndex) => {
            const [childW] = child.calcDynamicWH();
            children[childIndex].x = prevX;
            children[childIndex].y = prevY;

            prevX += childW + target.gapX;
          });
        }

        if (target.layout === UIObjectLayout.FlexVertical) {
          children.forEach((child, childIndex) => {
            const [_childW, childH] = child.calcDynamicWH();
            children[childIndex].x = prevX;
            children[childIndex].y = prevY;

            prevY += childH + target.gapY;
          });
        }
      }

      if (!parentUncasted) {
        return;
      }

      const parent = parentUncasted as UIObjectShape;

      if (target.position === UIObjectPosition.Relative) {
        if (parent.layout === UIObjectLayout.Static) {
          target.x = parent.x + parent.offsetX + parent.paddingX + target.offsetX;
          target.y = parent.y + parent.offsetY + parent.paddingY + target.offsetY;
        }

        if (parent.layout === UIObjectLayout.Centered) {
          const [parentW, parentH] = parent.calcDynamicWH();
          const [targetW, targetH] = target.calcDynamicWH();

          target.x = (parent.x + parent.offsetX) + ((parentW / 2) - (targetW / 2));
          target.y = (parent.y + parent.offsetY) + ((parentH / 2) - (targetH / 2));
        }
      }

      if (target.position === UIObjectPosition.AbsoluteInternal) {
        target.x = parent.x + parent.offsetX + parent.paddingX + parent.internalOffsetX;
        target.y = parent.y + parent.offsetY + parent.paddingY + parent.internalOffsetY;
      }
    });
  }

  private renderUIObjects(uiObjectsStore: UIObjectsStore) {
    uiObjectsStore.traverseDFS((uiObject) => {
      if (uiObject) {
        (uiObject as UIObjectShape).draw();
      }
    });
  }

  private renderSDL() {
    const pixelBuffer = this.canvas.toBuffer('raw')
    this.window.render(this.width, this.height, this.width * 4, 'bgra32', pixelBuffer);
  }
}
