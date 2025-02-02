import { UIObjectShape } from "../../Shapes/UIObjectShape";
import { isPointOnLine } from "../../utils/isPointOnLine";

export class PrimitiveLine extends UIObjectShape {
  fillStyle = 'rgb(0, 0, 0)';
  fillStyleHovered = 'rgb(180, 180, 180)';
  lineWidth = 1;

  drawCoordOffset = true;

  draw(): void {
    this.ctx.strokeStyle = this.stateHover ? this.fillStyleHovered || this.fillStyle : this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + (this.drawCoordOffset ? this.offsetX : 0), this.y + (this.drawCoordOffset ? this.offsetY : 0));
    this.ctx.lineTo(this.x + this.w + (this.drawCoordOffset ? this.offsetX : 0), this.y + this.h + (this.drawCoordOffset ? this.offsetY : 0));
    this.ctx.stroke();
    this.ctx.closePath();
  }

  hoverPredicator(x: number, y: number) {
    const x1 = this.x + (this.drawCoordOffset ? this.offsetX : 0) - (this.lineWidth / 2);
    const y1 = this.y + (this.drawCoordOffset ? this.offsetY : 0) - (this.lineWidth / 2);
    const x2 = this.x + this.w + (this.drawCoordOffset ? this.offsetX : 0) + (this.lineWidth / 2);
    const y2 = this.y + this.h + (this.drawCoordOffset ? this.offsetY : 0) + (this.lineWidth / 2);

    const result = (
      ((x > x1) && (x < x2))
      &&
      ((y > y1) && (y < y2))
    );

    return result && isPointOnLine(
      this.x + (this.drawCoordOffset ? this.offsetX : 0), this.y + (this.drawCoordOffset ? this.offsetY : 0),
      this.x + this.w + (this.drawCoordOffset ? this.offsetX : 0), this.y + this.h + (this.drawCoordOffset ? this.offsetY : 0),
      x, y,
      this.lineWidth,
    );
  }
}
