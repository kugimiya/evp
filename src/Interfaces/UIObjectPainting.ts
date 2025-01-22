import type { CanvasRenderingContext2D } from "canvas";

export interface UIObjectPainting {
  ctx: CanvasRenderingContext2D;
  draw(): void;
}
