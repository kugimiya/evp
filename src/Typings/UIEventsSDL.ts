import { Sdl } from "@kmamal/sdl";

export type SDLMouseMoveEvent = {
  type: 'mouseMove',
  touch: boolean,
  x: number,
  y: number,
};

export type SDLMouseDownEvent = {
  type: 'mouseButtonDown',
  touch: boolean,
  button: Sdl.Mouse.Button,
  x: number,
  y: number,
};

export type SDLMouseUpEvent = {
  type: 'mouseButtonUp',
  touch: boolean,
  button: Sdl.Mouse.Button,
  x: number,
  y: number,
};
