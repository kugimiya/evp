import { CanvasRenderingContext2D } from "canvas";
import { UIObjectEventHandlers } from "../../Interfaces/UIObjectEventing";
import { LinkedObjectsStoreShape } from "../../Shapes/LinkedObjectsStoreShape";
import { PrimitiveRect } from "./PrimitiveRect";
import { PrimitiveText } from "./PrimitiveText";
import { UIObjectLayout, UIObjectPosition } from "../../Typings/UIObject";
import { UIGateObjectStatable } from "../../Interfaces/UIGateObjectStatable";

export class UIGateObject extends PrimitiveRect implements UIGateObjectStatable {
  textObject: PrimitiveText;
  portsWrapper: PrimitiveRect;
  inPorts: PrimitiveRect[] = [];
  outPorts: PrimitiveRect[] = [];

  fillStyle = 'rgb(200, 200, 200)';

  cellSize = 15;

  gateState: number | undefined = undefined;
  gateText: string = '';

  constructor(
    id: string,
    textId: string,
    objectsStore: LinkedObjectsStoreShape,
    ctx: CanvasRenderingContext2D,
    customHandlers: Partial<UIObjectEventHandlers>,
  ) {
    super(id, objectsStore, ctx, customHandlers);
    this.textObject = new PrimitiveText(textId, objectsStore, ctx, customHandlers);
    this.textObject.fillStyle = 'rgb(80, 32, 0)';
    this.textObject.position = UIObjectPosition.Relative;
    this.appendChildren([this.textObject]);

    this.portsWrapper = new PrimitiveRect(this.objectsStore.getRandomId(`PORT-WRAPPER`), this.objectsStore, this.ctx, {});
    this.portsWrapper.fillStyle = 'rgba(0, 0, 0, 0)';
    this.portsWrapper.position = UIObjectPosition.Relative;
    this.appendChildren([this.portsWrapper]);

    this.layout = UIObjectLayout.Centered;
  }

  applySettings(gateText: string, inPortCount: number, outPortCount: number) {
    this.gateText = gateText;
    this.portsWrapper.applyStyles({ w: 90, h: this.cellSize * (Math.max(inPortCount, outPortCount) + 1) });
    this.applyStyles({ w: 90, h: this.cellSize * (Math.max(inPortCount, outPortCount) + 1) });

    for (let i = 0; i < inPortCount; i++) {
      const port = new PrimitiveRect(this.objectsStore.getRandomId(`IN-PORT-${i}`), this.objectsStore, this.ctx, {});
      port.position = UIObjectPosition.Relative;
      port.drawCoordOffset = false;
      port.isHoverableCursor = true;
      port.applyStyles({ w: 5, h: 5, offsetX: -2.5, offsetY: (this.cellSize * (i + 1)) - 2.5 });
      port.fillStyle = 'rgb(80, 32, 0)';
      this.inPorts.push(port);
    }

    for (let i = 0; i < outPortCount; i++) {
      const port = new PrimitiveRect(this.objectsStore.getRandomId(`OUT-PORT-${i}`), this.objectsStore, this.ctx, {});
      port.position = UIObjectPosition.Relative;
      port.drawCoordOffset = false;
      port.isHoverableCursor = true;
      port.applyStyles({ w: 5, h: 5, offsetX: 90 - 2.5, offsetY: (this.cellSize * (i + 1)) - 2.5 });
      port.fillStyle = 'rgb(80, 32, 0)';
      this.outPorts.push(port);
    }

    this.portsWrapper.appendChildren([...this.inPorts, ...this.outPorts]);
  }

  draw(): void {
    this.fillStyle = this.gateState === 1 ? 'rgb(4, 191, 138)' : this.gateState === 0 ? 'rgb(166, 43, 31)' : 'rgb(244, 226, 222)';
    this.textObject.text = `${this.gateText}${this.gateState !== undefined ? `(${this.gateState})` : ''}`;
    super.draw();
  }
}
