import { Sdl } from "@kmamal/sdl";

export interface UIEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
}

export interface IEventMouseMove extends UIEvent {
  x: number;
  y: number;

  offsetX: number;
  offsetY: number;
}

export interface IEventMouseButton extends UIEvent {
  x: number;
  y: number;

  offsetX: number;
  offsetY: number;

  button: Sdl.Mouse.Button;
}
