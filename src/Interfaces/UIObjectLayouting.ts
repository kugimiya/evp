import { UIObjectLayout, UIObjectPosition } from "../Typings/UIObject";

export interface UIObjectLayoutingBase {
  position: UIObjectPosition;
  layout: UIObjectLayout;
  isVisible: boolean;

  x: number;
  y: number;

  w: number;
  h: number;

  offsetX: number;
  offsetY: number;

  internalOffsetX: number;
  internalOffsetY: number;

  paddingX: number;
  paddingY: number;

  gapX: number;
  gapY: number;
}

export interface UIObjectLayouting extends UIObjectLayoutingBase {
  calcDynamicWH(): [w: number, h: number];
  applyStyles(styles: Partial<UIObjectLayoutingBase>): void;
}
