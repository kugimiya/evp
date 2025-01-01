import { Sdl } from "@kmamal/sdl";
import { CanvasRenderingContext2D } from "canvas";

type CustomHandlers = Partial<{
  onHover: () => void | boolean;
  onBlur: () => void | boolean;
  onClick: (button: Sdl.Mouse.Button, x: number, y: number) => void | boolean;
  onMouseDown: (button: Sdl.Mouse.Button) => void | boolean;
  onMouseUp: (button: Sdl.Mouse.Button) => void | boolean;
  onMouseMove: (x: number, y: number, offsetX: number, offsetY: number) => void | boolean;
}>;

export class UIObject {
  id: string;

  x: number;
  y: number;

  offsetX: number = 0;
  offsetY: number = 0;

  paddingX: number = 0;
  paddingY: number = 0;

  width: number;
  height: number;

  children: UIObject[];

  ctx: CanvasRenderingContext2D;

  hoverState = false;
  mouseLeftButtonDownState = false;
  mouseRightButtonDownState = false;
  mouseMiddleButtonDownState = false;

  hoverable = false;
  position: 'fixed' | 'relative' = 'fixed';

  customHandlers: CustomHandlers = {};

  gateState: undefined | number = undefined;

  constructor(id: string, x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.children = [];
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }

  draw(): void { }

  appendChildren(children: UIObject[]): void {
    this.children = [...this.children, ...children];
  }

  onMouseMove(x: number, y: number, offsetX: number, offsetY: number): void {
    if (this.customHandlers.onMouseMove) {
      if (this.customHandlers.onMouseMove(x, y, offsetX, offsetY) === false) {
        return;
      }
    }
  }

  onMouseDown(button: Sdl.Mouse.Button): void {
    if (this.customHandlers.onMouseDown) {
      if (this.customHandlers.onMouseDown(button) === false) {
        return;
      }
    }
  }

  onMouseUp(button: Sdl.Mouse.Button): void {
    if (this.customHandlers.onMouseUp) {
      if (this.customHandlers.onMouseUp(button) === false) {
        return;
      }
    }
  }

  onClick(button: Sdl.Mouse.Button, x: number, y: number): void {
    if (this.customHandlers.onClick) {
      if (this.customHandlers.onClick(button, x, y) === false) {
        return;
      }
    }
  }

  onHover(): void {
    if (this.customHandlers.onHover) {
      if (this.customHandlers.onHover() === false) {
        return;
      }
    }
  }

  onBlur(): void {
    if (this.customHandlers.onBlur) {
      if (this.customHandlers.onBlur() === false) {
        return;
      }
    }
  }
}
