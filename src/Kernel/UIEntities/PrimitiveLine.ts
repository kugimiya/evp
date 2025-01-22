import { UIObjectShape } from "../../Shapes/UIObjectShape";

export class PrimitiveLine extends UIObjectShape {
  fillStyle = 'rgb(0, 0, 0)';
  lineWidth = 1;

  drawCoordOffset = true;

  draw(): void {
    this.ctx.strokeStyle = this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + (this.drawCoordOffset ? this.offsetX : 0), this.y + (this.drawCoordOffset ? this.offsetY : 0));
    this.ctx.lineTo(this.x + this.w + (this.drawCoordOffset ? this.offsetX : 0), this.y + this.h + (this.drawCoordOffset ? this.offsetY : 0));
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
