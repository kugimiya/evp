import { UIObjectShape } from "../../Shapes/UIObjectShape";

export class PrimitiveRect extends UIObjectShape {
  fillStyle = 'rgb(0, 0, 0)';
  fillStyleHovered?: string;
  drawCoordOffset = true;

  draw(): void {
    this.ctx.fillStyle = this.stateHover ? this.fillStyleHovered || this.fillStyle : this.fillStyle;
    this.ctx.fillRect(this.x + (this.drawCoordOffset ? this.offsetX : 0), this.y + (this.drawCoordOffset ? this.offsetY : 0), this.w, this.h);
  }
}
