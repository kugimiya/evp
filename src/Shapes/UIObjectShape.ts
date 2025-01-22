import { mouse } from "@kmamal/sdl";
import type { CanvasRenderingContext2D } from "canvas";
import { LinkedEntity } from "../Interfaces/LinkedEntity";
import { UIObjectEventHandlers, UIObjectEventing } from "../Interfaces/UIObjectEventing";
import { UIObjectLayouting, UIObjectLayoutingBase } from "../Interfaces/UIObjectLayouting";
import { UIObjectLayout, UIObjectPosition } from "../Typings/UIObject";
import { LinkedEntityShape } from "./LinkedEntityShape";
import { LinkedObjectsStoreShape } from "./LinkedObjectsStoreShape";
import { UIObjectPainting } from "../Interfaces/UIObjectPainting";
import { IEventMouseButton, IEventMouseMove } from "../Interfaces/UIEvent";

export abstract class UIObjectShape extends LinkedEntityShape implements LinkedEntity, UIObjectEventing, UIObjectLayouting, UIObjectPainting {
  constructor(
    id: string,
    objectsStore: LinkedObjectsStoreShape,
    public ctx: CanvasRenderingContext2D,
    public customHandlers: Partial<UIObjectEventHandlers>,
  ) {
    super(id, objectsStore);
  }

  // painting
  abstract draw(): void;

  // layouting
  position = UIObjectPosition.Absolute;
  layout = UIObjectLayout.Static;
  isVisible = true;
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  offsetX = 0;
  offsetY = 0;
  internalOffsetX = 0;
  internalOffsetY = 0;
  paddingX = 0;
  paddingY = 0;
  gapX = 0;
  gapY = 0;

  calcDynamicWH(): [w: number, h: number] {
    return [this.w, this.h];
  }

  applyStyles(styles: Partial<UIObjectLayoutingBase>) {
    Object.entries(styles).forEach(([key, value]) => {
      // @ts-ignore idk how to fix this ts error
      this[key as keyof UIObjectLayoutingBase] = value;
    });
  }

  // eventing
  stateHover = false;
  stateLeftMouseButtonDown = false;
  stateMiddleMouseButtonDown = false;
  stateRightMouseButtonDown = false;
  isHoverable = true;
  isHoverableCursor = false;
  isMouseMovable = true;
  isMouseDownable = true;
  isClickable = true;

  onDelete() {}

  onHover(event: IEventMouseMove) {
    if (this.customHandlers.onHover) {
      if (!this.customHandlers.onHover(event)) {
        this.stateHover = true;
      }
    } else {
      this.stateHover = true;
    }

    if (this.isHoverableCursor) {
      mouse.setCursor('hand');
    }
  }

  onBlur(event: IEventMouseMove) {
    if (this.customHandlers.onBlur) {
      if (!this.customHandlers.onBlur(event)) {
        this.stateHover = false;
      }
    } else {
      this.stateHover = false;
    }

    if (this.isHoverableCursor) {
      mouse.setCursor('arrow');
    }
  }

  onMouseMove(event: IEventMouseMove) {
    if (this.customHandlers.onMouseMove) {
      this.customHandlers.onMouseMove(event);
    }
  }

  onMouseDown(event: IEventMouseButton) {
    if (this.customHandlers.onMouseDown) {
      if (!this.customHandlers.onMouseDown(event)) {
        this.processMouseButtonEvent(event, true);
      }
    } else {
      this.processMouseButtonEvent(event, true);
    }
  }

  onMouseUp(event: IEventMouseButton) {
    if (this.customHandlers.onMouseUp) {
      if (!this.customHandlers.onMouseUp(event)) {
        this.processMouseButtonEvent(event, true);
      }
    } else {
      this.processMouseButtonEvent(event, true);
    }
  }

  onClick(event: IEventMouseButton) {
    if (this.customHandlers.onClick) {
      this.customHandlers.onClick(event);
    }
  }

  private processMouseButtonEvent(event: IEventMouseButton, value: boolean) {
    switch (event.button) {
      case mouse.BUTTON.LEFT:
        this.stateLeftMouseButtonDown = value;
        break;

      case mouse.BUTTON.RIGHT:
        this.stateRightMouseButtonDown = value;
        break;

      case mouse.BUTTON.MIDDLE:
        this.stateMiddleMouseButtonDown = value;
        break;
    }
  }
}
