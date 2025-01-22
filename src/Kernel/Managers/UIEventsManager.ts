import { UIObjectShape } from "../../Shapes/UIObjectShape";
import { SDLMouseDownEvent, SDLMouseMoveEvent, SDLMouseUpEvent } from "../../Typings/UIEventsSDL";
import { UIObjectsStore } from "../Stores/UIObjectsStore";
import { EventMouseButton } from "../UIEvents/EventMouseButton";
import { EventMouseMove } from "../UIEvents/EventMouseMove";
import { UIManager } from "./UIManager";

export class UIEventsManager {
  prevMouseX = 0;
  prevMouseY = 0;
  hoveredUIObjects: Set<string> = new Set();

  constructor(private uiManager: UIManager, private uiObjectsStore: UIObjectsStore) {
    this.uiManager.window.on("mouseMove", this.handleMouseMove.bind(this));
    this.uiManager.window.on("mouseButtonDown", this.handleMouseDown.bind(this));
    this.uiManager.window.on("mouseButtonUp", this.handleMouseUp.bind(this));
  }

  handleMouseMove(sdlEvent: SDLMouseMoveEvent) {
    const offsetX = sdlEvent.x - this.prevMouseX;
    const offsetY = sdlEvent.y - this.prevMouseY;
    this.prevMouseX = sdlEvent.x;
    this.prevMouseY = sdlEvent.y;

    // Process MouseMove
    const uiEvent = new EventMouseMove({ x: sdlEvent.x, y: sdlEvent.y, offsetX, offsetY });
    const objectsInEvent = this.getTargetSubtree(sdlEvent.x, sdlEvent.y);

    objectsInEvent.forEach((uiObject) => {
      if (uiEvent.propagationStopped) {
        return;
      }

      if (!uiObject.isMouseMovable) {
        return;
      }

      if (uiObject.onMouseMove) {
        uiObject.onMouseMove(uiEvent);
      }
    });

    // Pre process Hover/Blur
    const objectsInMouse = this.getAllObjectsInCoords(sdlEvent.x, sdlEvent.y).map(_ => _.id);
    const needBlur: string[] = [];
    const needHover: string[] = [];
    this.hoveredUIObjects.forEach((uiObjectId) => {
      if (!objectsInMouse.includes(uiObjectId)) {
        needBlur.push(uiObjectId);
      }
    });
    objectsInMouse.forEach((uiObjectId) => {
      if (!this.hoveredUIObjects.has(uiObjectId)) {
        needHover.push(uiObjectId);
      }
    });
    needBlur.forEach((uiObjectId) => this.hoveredUIObjects.delete(uiObjectId));
    needHover.forEach((uiObjectId) => this.hoveredUIObjects.add(uiObjectId));

    // Process Hover/Blur
    needBlur
      .map((uiObjectId) => this.uiObjectsStore.objectsMap.get(uiObjectId) as UIObjectShape)
      .forEach((uiObject) => {
        if (uiObject.isHoverable) {
          uiObject.onBlur(uiEvent);
        }
      });

    needHover
      .map((uiObjectId) => this.uiObjectsStore.objectsMap.get(uiObjectId) as UIObjectShape)
      .forEach((uiObject) => {
        if (uiObject.isHoverable) {
          uiObject.onHover(uiEvent);
        }
      });
  }

  handleMouseDown(sdlEvent: SDLMouseDownEvent) {
    const offsetX = sdlEvent.x - this.prevMouseX;
    const offsetY = sdlEvent.y - this.prevMouseY;
    this.prevMouseX = sdlEvent.x;
    this.prevMouseY = sdlEvent.y;

    const uiEvent = new EventMouseButton({ x: sdlEvent.x, y: sdlEvent.y, offsetX, offsetY, button: sdlEvent.button });
    const objectsInEvent = this.getTargetSubtree(sdlEvent.x, sdlEvent.y);
    objectsInEvent.forEach((uiObject) => {
      if (uiEvent.propagationStopped) {
        return;
      }

      if (!uiObject.isMouseDownable) {
        return;
      }

      if (uiObject.onMouseDown) {
        uiObject.onMouseDown(uiEvent);
      }
    });
  }

  handleMouseUp(sdlEvent: SDLMouseUpEvent) {
    const offsetX = sdlEvent.x - this.prevMouseX;
    const offsetY = sdlEvent.y - this.prevMouseY;
    this.prevMouseX = sdlEvent.x;
    this.prevMouseY = sdlEvent.y;

    const uiEvent = new EventMouseButton({ x: sdlEvent.x, y: sdlEvent.y, offsetX, offsetY, button: sdlEvent.button });
    const objectsInEvent = this.getTargetSubtree(sdlEvent.x, sdlEvent.y);

    // Process MouseUp
    objectsInEvent.forEach((uiObject) => {
      if (uiEvent.propagationStopped) {
        return;
      }

      if (!uiObject.isMouseDownable) {
        return;
      }

      if (uiObject.onMouseUp) {
        uiObject.onMouseUp(uiEvent);
      }
    });

    // Process Click
    uiEvent.propagationStopped = false;
    objectsInEvent.forEach((uiObject) => {
      if (uiEvent.propagationStopped) {
        return;
      }

      if (!uiObject.isClickable) {
        return;
      }

      if (uiObject.onClick) {
        uiObject.onClick(uiEvent);
      }
    });
  }

  getTargetSubtree(x: number, y: number): UIObjectShape[] {
    const objectsInEvent = this.getAllObjectsInCoords(x, y);
    const subTrees = objectsInEvent.map((object) => this.uiObjectsStore.getParents(object.id));
    const longestSubTree = subTrees.reduce((longest, current) => current.length > longest.length ? current : longest, []);
    return longestSubTree.map((objectId) => this.uiObjectsStore.objectsMap.get(objectId) as UIObjectShape);
  }

  getAllObjectsInCoords(x: number, y: number): UIObjectShape[] {
    return this.uiObjectsStore.objects
      .filter((object) => this.isCoordsInObject(x, y, object as UIObjectShape)) as UIObjectShape[];
  }

  isCoordsInObject(x: number, y: number, object: UIObjectShape): boolean {
    return (
      ((x > object.x) && (x < (object.x + object.w)))
      &&
      ((y > object.y) && (y < (object.y + object.h)))
    );
  }
}
