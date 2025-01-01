import { mouse, Sdl } from "@kmamal/sdl";
import { UIConnector } from "./UIConnector";
import { UIObject } from "../ui/UIObject";

type MouseMoveArgs = {
  x: number;
  y: number;
}

type MouseButtonsUpDownArgs = {
  x: number;
  y: number;
  button: Sdl.Mouse.Button;
}

export class Dispatcher {
  ui: UIConnector;

  prevMouseX = 0;
  prevMouseY = 0;

  constructor(ui: UIConnector) {
    this.ui = ui;

    this.ui.window.on("mouseMove", this.onMouseMove.bind(this));
    this.ui.window.on("mouseButtonDown", this.onMouseDown.bind(this));
    this.ui.window.on("mouseButtonUp", this.onMouseUp.bind(this));
  }

  forEachByCoords(x: number, y: number, cb: (object: UIObject, mouseIn: boolean) => void): void {
    this.ui.uiObjects.forEach((object) => {
      let objectX = object.x;
      let objectY = object.y;

      if (object.position === 'relative') {
        objectX = object.x + object.offsetX;
        objectY = object.y + object.offsetY;
      }

      const mouseIn = ((x > objectX) && (x < (objectX + object.width))) && (y > objectY) && (y < (objectY + object.height));

      cb(object, mouseIn);
    });
  }

  onMouseMove({ x, y }: MouseMoveArgs) {
    const offsetX = x - this.prevMouseX;
    const offsetY = y - this.prevMouseY;
    this.prevMouseX = x;
    this.prevMouseY = y;

    this.forEachByCoords(x, y, (object, mouseIn) => {
      if (mouseIn) {
        object.onMouseMove(x, y, offsetX, offsetY);
      }

      if (mouseIn && object.hoverState === false) {
        object.hoverState = true;
        object.onHover();

        if (object.hoverable) {
          mouse.setCursor('hand');
        }
      }

      if (!mouseIn && object.hoverState === true) {
        object.hoverState = false;
        object.onBlur();

        if (object.hoverable) {
          mouse.setCursor('arrow');
        }
      }

      if (!mouseIn && object.mouseLeftButtonDownState) {
        object.mouseLeftButtonDownState = false;
        object.onMouseUp(mouse.BUTTON.LEFT);
      }

      if (!mouseIn && object.mouseRightButtonDownState) {
        object.mouseRightButtonDownState = false;
        object.onMouseUp(mouse.BUTTON.RIGHT);
      }

      if (!mouseIn && object.mouseMiddleButtonDownState) {
        object.mouseMiddleButtonDownState = false;
        object.onMouseUp(mouse.BUTTON.MIDDLE);
      }
    });
  }

  onMouseDown({ button, x, y }: MouseButtonsUpDownArgs) {
    this.forEachByCoords(x, y, (object, mouseIn) => {
      if (!mouseIn) {
        return;
      }

      if (button === mouse.BUTTON.LEFT) {
        if (!object.mouseLeftButtonDownState) {
          object.onMouseDown(button);
        }
        object.mouseLeftButtonDownState = true;
      }

      if (button === mouse.BUTTON.RIGHT) {
        if (!object.mouseRightButtonDownState) {
          object.onMouseDown(button);
        }
        object.mouseRightButtonDownState = true;
      }

      if (button === mouse.BUTTON.MIDDLE) {
        if (!object.mouseMiddleButtonDownState) {
          object.onMouseDown(button);
        }
        object.mouseMiddleButtonDownState = true;
      }
    });
  }

  onMouseUp({ button, x, y }: MouseButtonsUpDownArgs) {
    this.forEachByCoords(x, y, (object, mouseIn) => {
      if (!mouseIn) {
        return;
      }

      if (button === mouse.BUTTON.LEFT) {
        if (object.mouseLeftButtonDownState) {
          object.onMouseUp(button);
          object.onClick(button, x, y);
        }
        object.mouseLeftButtonDownState = false;
      }

      if (button === mouse.BUTTON.RIGHT) {
        if (object.mouseRightButtonDownState) {
          object.onMouseUp(button);
          object.onClick(button, x, y);
        }
        object.mouseRightButtonDownState = false;
      }

      if (button === mouse.BUTTON.MIDDLE) {
        if (object.mouseMiddleButtonDownState) {
          object.onMouseUp(button);
          object.onClick(button, x, y);
        }
        object.mouseMiddleButtonDownState = false;
      }
    });
  }
}
