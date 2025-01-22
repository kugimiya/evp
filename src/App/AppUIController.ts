import { IEventMouseButton, IEventMouseMove } from "../Interfaces/UIEvent";
import { GatePortEntity } from "../Kernel/GateEntities/GatePortEntity";
import { GateObjectsStore } from "../Kernel/Stores/GateObjectsStore";
import { PrimitiveRect } from "../Kernel/UIEntities/PrimitiveRect";
import { UIGateObject } from "../Kernel/UIEntities/UIGateObject";
import { GateObjectShape } from "../Shapes/GateObjectShape";
import { UIObjectShape } from "../Shapes/UIObjectShape";
import { UIObjectPosition } from "../Typings/UIObject";
import { App } from "./App";
import { AppUIBuilder } from "./AppUIBuilder";

export class AppUIController {
  isWirePlacing = false;
  currentWireOutPort: GatePortEntity | undefined = undefined;

  constructor(private uiBuilder: AppUIBuilder, private appCore: App, private gateStore: GateObjectsStore) {}

  bindUIButtonsHandlers() {
    const [andButton, notButton, orButton, norButton, constButton] = this.uiBuilder.gateButtons;

    andButton.customHandlers.onClick = (event) => {
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('AND', 2, 1),
        event,
        () => this.gateStore.createAndEntity(),
      );
    };

    notButton.customHandlers.onClick = (event) => {
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('NOT', 1, 1),
        event,
        () => this.gateStore.createNotEntity(),
      );
    };

    orButton.customHandlers.onClick = (event) => {
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('OR', 2, 1),
        event,
        () => this.gateStore.createOrEntity(),
      );
    };

    norButton.customHandlers.onClick = (event) => {
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('NOR', 2, 1),
        event,
        () => this.gateStore.createNorEntity(),
      );
    };

    constButton.customHandlers.onClick = (event) => {
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('CONST', 0, 1),
        event,
        () => this.gateStore.createConstEntity(),
        (object, gate) => {
          object.isHoverableCursor = true;
          object.customHandlers.onClick = () => {
            gate.value = Number(!gate.value);
          };
        }
      );
    };
  }

  private bindGateObjectPortsHandlers(inPorts: PrimitiveRect[], outPorts: PrimitiveRect[], gateInPorts: GatePortEntity[], gateOutPorts: GatePortEntity[]) {
    [inPorts, outPorts].forEach((ports, portTypeIndex) => {
      const gatePorts = portTypeIndex === 0 ? gateInPorts : gateOutPorts;
      ports.forEach((portUIObject, portIndex) => {
        portUIObject.customHandlers.onClick = (event) => {
          event.stopPropagation();

          if (!this.isWirePlacing) {
            this.isWirePlacing = true;

            const wireObject = this.appCore.kernel.uiObjectsStore.createUIGateWireObject();
            this.uiBuilder.uiCanvas.appendChildren([wireObject]);
            const [wireX, wireY] = this.getPositionInCanvasFromEvent(event);
            wireObject.applyStyles({ x: 0, y: 0, offsetX: wireX, offsetY: wireY, w: 0, h: 0 });
            wireObject.outPort.applyStyles({ offsetX: 0 - 2.5, offsetY: 0 - 2.5 });

            const [wireGate, wireInPorts, wireOutPorts] = this.gateStore.createWireEntity();
            wireGate.onGateAction = (gateState) => {
              wireObject.gateState = gateState;
            }
            gateOutPorts[portIndex].appendChildren([wireInPorts[0]]);
            this.currentWireOutPort = wireOutPorts[0];

            this.uiBuilder.uiCanvas.customHandlers.onMouseMove = (subEvent) => {
              subEvent.stopPropagation();
              const [x, y] = this.getPositionInCanvasFromEvent(subEvent);
              wireObject.applyStyles({ w: x - wireX, h: y - wireY });
              wireObject.outPort.applyStyles({ offsetX: x - wireX - 2.5, offsetY: y - wireY - 2.5 });
            };

            this.uiBuilder.uiCanvas.customHandlers.onClick = (subEvent) => {
              subEvent.stopPropagation();
              this.isWirePlacing = false;
              this.uiBuilder.uiCanvas.customHandlers.onMouseMove = undefined;
              this.uiBuilder.uiCanvas.customHandlers.onClick = undefined;

              this.bindGateObjectPortsHandlers([wireObject.inPort], [wireObject.outPort], wireInPorts, wireOutPorts);
            }
          } else {
            if (this.currentWireOutPort) {
              this.currentWireOutPort.appendChildren([gatePorts[portIndex]]);
            }

            this.isWirePlacing = false;
            this.uiBuilder.uiCanvas.customHandlers.onMouseMove = undefined;
            this.uiBuilder.uiCanvas.customHandlers.onClick = undefined;

            this.gateStore.rebuildTree();
          }
        }
      })
    });
  }

  private enableMovingSpawnedGateEvents(
    object: UIGateObject,
    event: IEventMouseButton,
    gateCreator: () => [GateObjectShape, GatePortEntity[], GatePortEntity[]],
    onAfterCreate?: (object: UIGateObject, gate: GateObjectShape) => void,
  ) {
    event.stopPropagation();
    this.uiBuilder.uiCanvas.appendChildren([object]);
    object.position = UIObjectPosition.AbsoluteInternal;

    this.uiBuilder.uiCanvas.customHandlers.onMouseMove = (event) => {
      event.stopPropagation();
      const [x, y] = this.getPositionInCanvasFromEvent(event, object);
      object.offsetX = x;
      object.offsetY = y;
    };

    this.uiBuilder.uiCanvas.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.uiBuilder.uiCanvas.customHandlers.onMouseMove = undefined;
      this.uiBuilder.uiCanvas.customHandlers.onClick = undefined;

      const [gate, gateInPorts, gateOutPorts] = gateCreator();
      gate.onGateAction = (gateState) => {
        object.gateState = gateState;
      }

      this.bindGateObjectPortsHandlers(object.inPorts, object.outPorts, gateInPorts, gateOutPorts);
      if (onAfterCreate) {
        onAfterCreate(object, gate);
      }
    }
  }

  private getPositionInCanvasFromEvent(event: IEventMouseButton | IEventMouseMove, object?: UIObjectShape) {
    return [
      this.roundNumber(event.x - this.uiBuilder.uiCanvas.internalOffsetX - this.uiBuilder.sizes.sidebar - ((object?.w || 0) / 2), this.uiBuilder.sizes.cellSize),
      this.roundNumber(event.y - this.uiBuilder.uiCanvas.internalOffsetY - ((object?.h || 0) / 2), this.uiBuilder.sizes.cellSize)
    ];
  }

  private roundNumber(origin: number, rounder: number): number {
    return Math.round(origin / rounder) * rounder;
  }
}
