import { IEventMouseMove, UIEvent } from "../../Interfaces/UIEvent";
import { UIEventShape } from "../../Shapes/UIEventShape";

export class EventMouseMove extends UIEventShape implements IEventMouseMove {
  x = 0;
  y = 0;
  offsetX = 0;
  offsetY = 0;

  constructor(init?: Partial<Omit<IEventMouseMove, keyof UIEvent>>) {
    super();

    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this[key as keyof Omit<IEventMouseMove, keyof UIEvent>] = value;
      });
    }
  }
}
