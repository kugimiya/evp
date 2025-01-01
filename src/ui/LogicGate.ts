import { CanvasRenderingContext2D } from "canvas";
import { UIObject } from "./UIObject";
import { PrimitiveRect } from "./PrimitiveRect";

const makePort = (id: string, offsetX: number, offsetY: number, ctx: CanvasRenderingContext2D, clickCb?: (x: number, y: number) => void): UIObject => {
  const port = new PrimitiveRect(id, 'rgba(227, 197, 103, 1)', 0, 0, 5, 5, ctx);
  port.offsetX = offsetX;
  port.offsetY = offsetY;
  port.hoverable = true;
  port.hoverFillStyle = 'rgba(209, 70, 47, 1)';
  port.position = 'relative';

  if (clickCb) {
    port.customHandlers.onClick = (button, x, y) => {
      clickCb(x, y);
    }
  }

  return port;
}

export class LogicGate extends UIObject {
  fillStyleTrue = 'rgba(87, 61, 28, 1)';
  fillStyleFalse = 'rgba(254, 74, 73, 1)';
  textStyle = 'rgba(255, 255, 255, 1)';
  font = '14px monospace';

  inPorts: UIObject[] = [];
  outPorts: UIObject[] = [];

  text: string;

  textX = 0;
  textY = 0;

  gateType: 'const' | 'other' = 'other';

  constructor(
    id: string,
    text: string,
    inPorts: number,
    outPorts: number,
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    inPortsClickCbs?: (portNum: number, x: number, y: number) => void,
    outPortsClickCbs?: (portNum: number, x: number, y: number) => void
  ) {
    const width = 60;
    const height = 40;

    super(id, x, y, width, height, ctx);
    this.text = text;
    this.position = 'relative';

    const centerY = height / 2;
    const startInPorts = centerY / Math.max(inPorts - 1, 1);
    const startOutPorts = centerY / Math.max(outPorts - 1, 1);

    for (let i = 0; i < inPorts; i++) {
      const offset = ((startInPorts * i) - 2.5) + (centerY / 2);
      const inPort = makePort(`${id}-in-${i}`, x + -2.5, y + offset, ctx, inPortsClickCbs ? (x, y) => inPortsClickCbs(i, x, y) : undefined);
      this.inPorts.push(inPort);
    }

    for (let i = 0; i < outPorts; i++) {
      const offset = ((startOutPorts * i) - 2.5) + (centerY / 2);
      const outPort = makePort(`${id}-in-${i}`, x + 58.5, y + offset, ctx, outPortsClickCbs ? (x, y) => outPortsClickCbs(i, x, y) : undefined);
      this.outPorts.push(outPort);
    }

    this.appendChildren([...this.inPorts, ...this.outPorts]);

    this.ctx.font = this.font;
    const metrics = this.ctx.measureText(text);
    this.textX = ((width / 2) - (metrics.width / 2)) + x;
    this.textY = ((height / 2) + (14 / 4)) + y;
  }

  applyCoords(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.ctx.font = this.font;
    const metrics = this.ctx.measureText(this.text);
    this.textX = ((this.width / 2) - (metrics.width / 2)) + x;
    this.textY = ((this.height / 2) + (14 / 4)) + y;

    this.inPorts.forEach((item) => {
      item.x = x;
      item.y = y;
    });

    this.outPorts.forEach((item) => {
      item.x = x;
      item.y = y;
    });
  }

  applyOffset(offsetX: number, offsetY: number) {
    this.offsetX += offsetX;
    this.offsetY += offsetY;

    this.inPorts.forEach((item) => {
      item.offsetX += offsetX;
      item.offsetY += offsetY;
    });

    this.outPorts.forEach((item) => {
      item.offsetX += offsetX;
      item.offsetY += offsetY;
    });
  }

  draw() {
    this.ctx.fillStyle = this.gateState ? this.fillStyleTrue : this.fillStyleFalse;
    this.ctx.fillRect(this.offsetX + this.x, this.offsetY + this.y, this.width, this.height);
    this.children.forEach((child) => child.draw());

    this.ctx.fillStyle = this.textStyle;
    this.ctx.font = this.font;
    this.ctx.fillText(this.gateType === 'other' ? this.text : `${this.gateState}`, this.offsetX + this.textX, this.offsetY + this.textY);
  }
}
