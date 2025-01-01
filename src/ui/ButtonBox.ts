import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";

export class ButtonBox extends UIObject {
  fillStyle = 'rgba(127, 127, 127, 255)';

  constructor(id: string, x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    super(id, x, y, width, height, ctx);
  }

  draw() {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(this.offsetX + this.x, this.offsetY + this.y, this.width, this.height);
    this.children.forEach((child) => child.draw());
  }

  appendChildren(children: UIObject[]): void {
    super.appendChildren(children);
    this.children.forEach((child) => {
      child.position = 'relative';
      child.offsetX = this.x + this.paddingX;
      child.offsetY = this.y + this.paddingY;
    });
  }
}
