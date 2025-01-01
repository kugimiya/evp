import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";

export class MovableCanvas extends UIObject {
  fillStyle: string;
  strokeStyle: string;

  dotSpacing = 20;
  offsetX = 0;
  offsetY = 0;

  constructor(id: string, fillStyle: string, strokeStyle: string, x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    super(id, x, y, width, height, ctx);
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  draw() {
    // draw bg
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw grid
    this.ctx.fillStyle = this.strokeStyle;
    const startI = Math.floor(this.offsetX / this.dotSpacing) * this.dotSpacing * -1;
    const startJ = Math.floor(this.offsetY / this.dotSpacing) * this.dotSpacing * -1;

    for (let i = startI; i <= this.width + (this.offsetX * -1); i += this.dotSpacing) {
      for (let j = startJ; j <= this.height + (this.offsetY * - 1); j += this.dotSpacing) {
        this.ctx.fillRect(this.offsetX + this.x + i, this.offsetY + this.y + j, 1, 1);
      }
    }

    this.children.forEach((child) => child.draw());
  }
}
