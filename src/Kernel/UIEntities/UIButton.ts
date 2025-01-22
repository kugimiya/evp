import { CanvasRenderingContext2D } from "canvas";
import { UIObjectEventHandlers } from "../../Interfaces/UIObjectEventing";
import { LinkedObjectsStoreShape } from "../../Shapes/LinkedObjectsStoreShape";
import { PrimitiveRect } from "./PrimitiveRect";
import { PrimitiveText } from "./PrimitiveText";
import { UIObjectLayout, UIObjectPosition } from "../../Typings/UIObject";

export class UIButton extends PrimitiveRect {
  textObject: PrimitiveText;

  fillStyle = 'rgb(180, 180, 180)';
  fillStyleHovered = 'rgb(100, 180, 180)';

  constructor(
    id: string,
    textId: string,
    objectsStore: LinkedObjectsStoreShape,
    ctx: CanvasRenderingContext2D,
    customHandlers: Partial<UIObjectEventHandlers>,
  ) {
    super(id, objectsStore, ctx, customHandlers);
    this.textObject = new PrimitiveText(textId, objectsStore, ctx, customHandlers);
    this.textObject.position = UIObjectPosition.Relative;

    this.layout = UIObjectLayout.Centered;
    this.isHoverableCursor = true;

    this.appendChildren([this.textObject]);
    this.applyStyles({ w: 150, h: 32 });
  }

  draw(): void {
    super.draw();
  }
}
