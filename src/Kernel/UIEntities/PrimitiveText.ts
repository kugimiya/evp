import { UIObjectShape } from "../../Shapes/UIObjectShape";

export class PrimitiveText extends UIObjectShape {
  fillStyle = 'rgb(255, 255, 255)';

  fontSize = 14;
  fontFamily = 'monospace';
  fontWeight = 'bold';

  text = '';

  draw(): void {
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.offsetY = -1 * (this.fontSize / 4);
    this.ctx.fillText(this.text, this.x + this.offsetX, this.y + this.offsetY + this.fontSize);
  }

  calcDynamicWH(): [w: number, h: number] {
    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    const measures = this.ctx.measureText(this.text);
    return [measures.width, this.fontSize];
  }
}
