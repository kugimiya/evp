import type { CanvasRenderingContext2D } from "canvas";
import { LinkedObjectsStoreShape } from "../../Shapes/LinkedObjectsStoreShape";
import { PrimitiveRect } from "../UIEntities/PrimitiveRect";
import { PrimitiveText } from "../UIEntities/PrimitiveText";
import { UIButton } from "../UIEntities/UIButton";
import { UICanvas } from "../UIEntities/UICanvas";
import { UIGateObject } from "../UIEntities/UIGateObject";
import { UIObjectPosition } from "../../Typings/UIObject";
import { PrimitiveLine } from "../UIEntities/PrimitiveLine";
import { UIGateWireObject } from "../UIEntities/UIGateWireObject";

export const UI_OBJECTS_LABELS = {
  PRIM_RECT: 'PRIM_RECT',
  PRIM_TEXT: 'PRIM_TEXT',
  PRIM_LINE: 'PRIM_LINE',
  UI_BUTTON: 'UI_BUTTON',
  UI_BUTTON_TEXT: 'UI_BUTTON_TEXT',
  UI_CANVAS: 'UI_CANVAS',
  UI_GATE_OBJECT: 'UI_GATE_OBJECT',
  UI_GATE_WIRE: 'UI_GATE_WIRE',
};

export class UIObjectsStore extends LinkedObjectsStoreShape {
  constructor(private ctx: CanvasRenderingContext2D) {
    super();
  }

  createPrimitiveRectEntity() {
    const obj = new PrimitiveRect(this.getRandomId(UI_OBJECTS_LABELS.PRIM_RECT), this, this.ctx, {});
    this.objects.push(obj);
    this.rebuildTree();
    return obj;
  }

  createPrimitiveTextEntity() {
    const obj = new PrimitiveText(this.getRandomId(UI_OBJECTS_LABELS.PRIM_TEXT), this, this.ctx, {});
    this.objects.push(obj);
    this.rebuildTree();
    return obj;
  }

  createPrimitiveLineEntity() {
    const obj = new PrimitiveLine(this.getRandomId(UI_OBJECTS_LABELS.PRIM_LINE), this, this.ctx, {});
    this.objects.push(obj);
    this.rebuildTree();
    return obj;
  }

  createUIButton() {
    const obj = new UIButton(this.getRandomId(UI_OBJECTS_LABELS.UI_BUTTON), this.getRandomId(UI_OBJECTS_LABELS.UI_BUTTON_TEXT), this, this.ctx, {});
    this.objects.push(obj);
    this.objects.push(obj.textObject);
    this.rebuildTree();
    return obj;
  }

  createUICanvas() {
    const obj = new UICanvas(this.getRandomId(UI_OBJECTS_LABELS.UI_CANVAS), this, this.ctx, {});
    this.objects.push(obj);
    this.rebuildTree();
    return obj;
  }

  createUIGateObject(gateText: string, inPortCount: number, outPortCount: number) {
    const obj = new UIGateObject(this.getRandomId(UI_OBJECTS_LABELS.UI_BUTTON), this.getRandomId(UI_OBJECTS_LABELS.UI_BUTTON_TEXT), this, this.ctx, {});
    obj.position = UIObjectPosition.AbsoluteInternal;
    obj.applySettings(gateText, inPortCount, outPortCount);
    [obj, obj.textObject, obj.portsWrapper, ...obj.inPorts, ...obj.outPorts].forEach((subObj) => {
      this.objects.push(subObj);
    });
    this.rebuildTree();
    return obj;
  }

  createUIGateWireObject() {
    const obj = new UIGateWireObject(this.getRandomId(UI_OBJECTS_LABELS.UI_GATE_WIRE), this, this.ctx, {});
    obj.position = UIObjectPosition.AbsoluteInternal;
    [obj, obj.inPort, obj.outPort].forEach((subObj) => {
      this.objects.push(subObj);
    });
    this.rebuildTree();
    return obj;
  }
}
