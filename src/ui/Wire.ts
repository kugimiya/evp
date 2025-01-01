import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";
import { PrimitiveRect } from "./PrimitiveRect";

const makePort = (id: string, offsetX: number, offsetY: number, ctx: CanvasRenderingContext2D): UIObject => {
  const port = new PrimitiveRect(id, 'rgba(227, 197, 103, 1)', 0, 0, 5, 5, ctx);
  port.offsetX = offsetX;
  port.offsetY = offsetY;
  port.hoverable = true;
  port.hoverFillStyle = 'rgba(209, 70, 47, 1)';
  port.position = 'relative';

  return port;
}

export class Wire extends UIObject {
  fillStyle = 'rgb(217, 174, 97)';
  fillStyleFalse = 'rgb(254, 74, 73)';

  x0 = 0;
  y0 = 0;
  x1 = 0;
  y1 = 0;

  wireCreated = false;

  inPort: UIObject;
  outPort: UIObject;

  inPortClick?: (x: number, y: number) => void;
  outPortClick?: (x: number, y: number) => void;

  constructor(
    id: string,
    x0: number,
    y0: number,
    ctx: CanvasRenderingContext2D,
    inPortsClickCbs?: (x: number, y: number) => void,
    outPortsClickCbs?: (x: number, y: number) => void
  ) {
    super(id, x0, y0, 2, 0, ctx);
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x0 + 10;
    this.y1 = y0 + 10;

    this.inPort = makePort(`${id}-in-0`, x0 - 2.5, y0 - 2.5, ctx);
    this.outPort = makePort(`${id}-out-0`, x0 - 2.5, y0 - 2.5, ctx);

    this.inPortClick = inPortsClickCbs;
    this.outPortClick = outPortsClickCbs;

    this.appendChildren([this.inPort, this.outPort]);
  }

  applyOffset(offsetX: number, offsetY: number) {
    this.offsetX += offsetX;
    this.offsetY += offsetY;
  }

  applyCbs() {
    if (this.inPortClick) {
      this.inPort.customHandlers.onClick = (_button, x, y) => {
        if (this.inPortClick) {
          this.inPortClick(x, y);
        }
      }
    }

    if (this.outPortClick) {
      this.outPort.customHandlers.onClick = (_button, x, y) => {
        if (this.outPortClick) {
          this.outPortClick(x, y);
        }
      }
    }
  }

  draw() {
    this.ctx.strokeStyle = this.gateState ? this.fillStyle : this.fillStyleFalse;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.offsetX + this.x0, this.offsetY + this.y0);
    this.ctx.lineTo(this.offsetX + this.x1, this.offsetY + this.y1);
    this.ctx.closePath();
    this.ctx.stroke();

    this.children.forEach((child) => child.draw());
  }
}
