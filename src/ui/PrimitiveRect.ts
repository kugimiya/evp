import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";

export class PrimitiveRect extends UIObject {
  fillStyle: string;
  hoverFillStyle: string = '';

  constructor(id: string, fillStyle: string, x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    super(id, x, y, width, height, ctx);
    this.fillStyle = fillStyle;
  }

  draw() {
    this.ctx.fillStyle = this.hoverState && this.hoverable ? this.hoverFillStyle : this.fillStyle;
    this.ctx.fillRect(this.offsetX + this.x, this.offsetY + this.y, this.width, this.height);
  }
}
