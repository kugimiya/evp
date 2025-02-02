import { CanvasRenderingContext2D } from "canvas";
import { UIObjectEventHandlers } from "../../Interfaces/UIObjectEventing";
import { LinkedObjectsStoreShape } from "../../Shapes/LinkedObjectsStoreShape";
import { PrimitiveRect } from "./PrimitiveRect";
import { UIObjectLayout, UIObjectPosition } from "../../Typings/UIObject";
import { PrimitiveLine } from "./PrimitiveLine";

export class UIGateWireObject extends PrimitiveLine {
  inPort: PrimitiveRect;
  outPort: PrimitiveRect;

  fillStyle = 'rgb(175, 200, 200)';
  fillStyleHovered = 'rgb(175, 175, 175)';
  lineWidth = 2.5;
  cellSize = 15;

  gateState: number | undefined = undefined;

  constructor(
    id: string,
    objectsStore: LinkedObjectsStoreShape,
    ctx: CanvasRenderingContext2D,
    customHandlers: Partial<UIObjectEventHandlers>,
  ) {
    super(id, objectsStore, ctx, customHandlers);
    this.layout = UIObjectLayout.Static;

    this.inPort = new PrimitiveRect(this.objectsStore.getRandomId(`IN-PORT-0`), this.objectsStore, this.ctx, {});
    this.inPort.position = UIObjectPosition.Relative;
    this.inPort.drawCoordOffset = false;
    this.inPort.isHoverableCursor = true;
    this.inPort.applyStyles({ w: 8, h: 8, offsetX: -4, offsetY: -4 });
    this.inPort.fillStyle = 'rgb(80, 32, 0)';

    this.outPort = new PrimitiveRect(this.objectsStore.getRandomId(`OUT-PORT-0`), this.objectsStore, this.ctx, {});
    this.outPort.position = UIObjectPosition.Relative;
    this.outPort.drawCoordOffset = false;
    this.outPort.isHoverableCursor = true;
    this.outPort.applyStyles({ w: 8, h: 8, offsetX: -4, offsetY: -4 });
    this.outPort.fillStyle = 'rgb(80, 32, 0)';

    this.appendChildren([this.inPort, this.outPort]);
  }

  draw(): void {
    this.fillStyle = this.gateState === 1 ? 'rgb(4, 191, 138)' : this.gateState === 0 ? 'rgb(166, 43, 31)' : 'rgb(244, 226, 222)';
    super.draw();
  }
}
