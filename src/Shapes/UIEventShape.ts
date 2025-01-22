import { UIEvent } from "../Interfaces/UIEvent";

export class UIEventShape implements UIEvent {
  propagationStopped = false;
  defaultPrevented = false;

  stopPropagation(): void {
    this.propagationStopped = true;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }
}
