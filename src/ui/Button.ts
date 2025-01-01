import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";

export class Button extends UIObject {
  fillStyle = 'rgba(80, 80, 80, 255)';
  font = '14px monospace';
  fontFillStyle = 'rgba(255, 255, 255, 255)';
  text: string;

  textX = 0;
  textY = 0;

  hoverable = true;

  constructor(id: string, text: string, x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    super(id, x, y, width, height, ctx);
    this.text = text;

    this.ctx.font = this.font;
    const metrics = this.ctx.measureText(text);
    this.textX = ((width / 2) - (metrics.width / 2)) + x;
    this.textY = ((height / 2) + (20 / 4)) + y;
  }

  draw(): void {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(this.offsetX + this.x, this.offsetY + this.y, this.width, this.height);

    this.ctx.fillStyle = this.fontFillStyle;
    this.ctx.font = this.font;
    this.ctx.fillText(this.text, this.offsetX + this.textX, this.offsetY + this.textY);
  }

  onHover(): void {
    super.onHover();
    this.fillStyle = 'rgba(120, 120, 120, 255)';
  }

  onBlur(): void {
    super.onBlur();
    this.fillStyle = 'rgba(80, 80, 80, 255)';
  }
}
