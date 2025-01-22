import sdl from "@kmamal/sdl";
import { IEventMouseButton } from "../../Interfaces/UIEvent";
import { UIEventShape } from "../../Shapes/UIEventShape";

export class EventMouseButton extends UIEventShape implements IEventMouseButton {
  x = 0;
  y = 0;
  offsetX = 0;
  offsetY = 0;
  button = sdl.mouse.BUTTON.LEFT;

  constructor(init?: Partial<Omit<IEventMouseButton, keyof UIEvent>>) {
    super();

    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this[key as keyof Omit<IEventMouseButton, keyof UIEvent>] = value;
      });
    }
  }
}
