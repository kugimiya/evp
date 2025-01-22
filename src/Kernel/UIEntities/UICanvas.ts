import sdl from "@kmamal/sdl";
import { IEventMouseButton, IEventMouseMove } from "../../Interfaces/UIEvent";
import { PrimitiveRect } from "./PrimitiveRect";

export class UICanvas extends PrimitiveRect {
  cellSize = 15;
  cellRadius = 2;
  fillStyle = 'rgb(75, 75, 75)';
  fillStyleCellDot = 'rgba(200, 200, 200, 0.45)';

  moveMode = false;

  onMouseDown(event: IEventMouseButton): void {
    super.onMouseDown(event);
    if (event.button === sdl.mouse.BUTTON.MIDDLE) {
      this.moveMode = true;
      event.stopPropagation();
    }
  }

  onMouseUp(event: IEventMouseButton): void {
    super.onMouseUp(event);
    if (event.button === sdl.mouse.BUTTON.MIDDLE) {
      this.moveMode = false;
      event.stopPropagation();
    }
  }

  onMouseMove(event: IEventMouseMove): void {
    super.onMouseMove(event);
    if (this.moveMode) {
      this.internalOffsetX += event.offsetX;
      this.internalOffsetY += event.offsetY;
      event.stopPropagation();
    }
  }

  draw(): void {
    super.draw();

    this.ctx.fillStyle = this.fillStyleCellDot;
    const startI = Math.floor(this.internalOffsetX / this.cellSize) * this.cellSize * -1;
    const startJ = Math.floor(this.internalOffsetY / this.cellSize) * this.cellSize * -1;

    for (let i = startI; i <= this.w + (this.internalOffsetX * -1); i += this.cellSize) {
      for (let j = startJ; j <= this.h + (this.internalOffsetY * - 1); j += this.cellSize) {
        this.ctx.fillRect(this.internalOffsetX + this.x + i - (this.cellRadius / 2), this.internalOffsetY + this.y + j - (this.cellRadius / 2), this.cellRadius, this.cellRadius);
      }
    }
  }
}
