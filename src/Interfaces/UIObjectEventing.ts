import { IEventMouseButton, IEventMouseMove } from "./UIEvent";

export interface UIObjectEventHandlers {
  onHover: (event: IEventMouseMove) => void | number;
  onBlur: (event: IEventMouseMove) => void | number;
  onMouseMove: (event: IEventMouseMove) => void | number;

  onMouseDown: (event: IEventMouseButton) => void | number;
  onMouseUp: (event: IEventMouseButton) => void | number;
  onClick: (event: IEventMouseButton) => void | number;

  onDelete: () => void;
}

export interface UIObjectEventing extends UIObjectEventHandlers {
  stateHover: boolean;

  stateLeftMouseButtonDown: boolean;
  stateMiddleMouseButtonDown: boolean;
  stateRightMouseButtonDown: boolean;

  isHoverable: boolean;
  isHoverableCursor: boolean;
  isMouseMovable: boolean;
  isMouseDownable: boolean;
  isClickable: boolean;

  customHandlers: Partial<UIObjectEventHandlers>;
  hoverPredicator: (x: number, y: number) => boolean;
}
