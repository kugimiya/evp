import { IEventMouseButton, IEventMouseMove } from "../Interfaces/UIEvent";
import { GatePortEntity } from "../Kernel/GateEntities/GatePortEntity";
import { GateObjectsStore } from "../Kernel/Stores/GateObjectsStore";
import { PrimitiveRect } from "../Kernel/UIEntities/PrimitiveRect";
import { UIGateObject } from "../Kernel/UIEntities/UIGateObject";
import { UIGateWireObject } from "../Kernel/UIEntities/UIGateWireObject";
import { GateObjectShape } from "../Shapes/GateObjectShape";
import { UIObjectShape } from "../Shapes/UIObjectShape";
import { UIObjectPosition } from "../Typings/UIObject";
import { App } from "./App";
import { AppUIBuilder } from "./AppUIBuilder";

export class AppUIController {
  toolState: 'select' | 'delete' = 'select';

  isWirePlacing = false;
  currentWireOutPort: GatePortEntity | undefined = undefined;

  constructor(private uiBuilder: AppUIBuilder, private appCore: App, private gateStore: GateObjectsStore) {}

  bindUIButtonsHandlers() {
    const [selectButton, deleteButton] = this.uiBuilder.uiStateButtons;

    selectButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableSelectTool();
    };

    deleteButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableDeleteTool();
    };

    const [andButton, notButton, orButton, norButton, constButton] = this.uiBuilder.gateButtons;

    andButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('AND', 2, 1),
        () => this.gateStore.createAndEntity(),
        (object, gate) => this.bindGateObjectOnClickHandler(object, gate),
      );
    };

    notButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('NOT', 1, 1),
        () => this.gateStore.createNotEntity(),
        (object, gate) => this.bindGateObjectOnClickHandler(object, gate),
      );
    };

    orButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('OR', 2, 1),
        () => this.gateStore.createOrEntity(),
        (object, gate) => this.bindGateObjectOnClickHandler(object, gate),
      );
    };

    norButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('NOR', 2, 1),
        () => this.gateStore.createNorEntity(),
        (object, gate) => this.bindGateObjectOnClickHandler(object, gate),
      );
    };

    constButton.customHandlers.onClick = (event) => {
      event.stopPropagation();
      this.enableMovingSpawnedGateEvents(
        this.appCore.kernel.uiObjectsStore.createUIGateObject('CONST', 0, 1),
        () => this.gateStore.createConstEntity(),
        (object, gate) => this.bindGateObjectOnClickHandler(object, gate, true),
      );
    };
  }

  private bindGateObjectOnClickHandler(object: UIGateObject, gate: GateObjectShape, isConstGate = false): void {
    if (isConstGate) {
      object.isHoverableCursor = true;
    }

    object.customHandlers.onClick = () => {
      if (this.toolState === 'delete') {
        const [gateInPorts, gateOutPorts] = gate.getPorts();

        this.appCore.kernel.gateObjectsStore.deleteObjects(
          [...gateInPorts.map(_ => ({ id: _[0] })), ...gateOutPorts.map(_ => ({ id: _[0] })), gate]
            .map(_ => (_ as GateObjectShape).id)
        );

        this.appCore.kernel.uiObjectsStore.deleteObjects(
          [...object.inPorts, ...object.outPorts, object.portsWrapper, object.textObject, object]
            .map(_ => {
              _.isVisible = false;
              return _.id;
            })
        );

        return;
      } else {
        if (isConstGate) {
          gate.value = Number(!gate.value);
        }
      }
    }
  }

  private bindWireGateObjectOnClickHandler(object: UIGateWireObject, gate: GateObjectShape): void {
    object.customHandlers.onClick = () => {
      if (this.toolState !== 'delete') {
        return;
      }

      const [gateInPorts, gateOutPorts] = gate.getPorts();

      this.appCore.kernel.gateObjectsStore.deleteObjects(
        [...gateInPorts.map(_ => ({ id: _[0] })), ...gateOutPorts.map(_ => ({ id: _[0] })), gate]
          .map(_ => (_ as GateObjectShape).id)
      );

      this.appCore.kernel.uiObjectsStore.deleteObjects(
        [object.inPort, object.outPort, object]
          .map(_ => {
            _.isVisible = false;
            return _.id;
          })
      );

      return;
    }
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
            wireObject.outPort.applyStyles({ offsetX: 0 - 4, offsetY: 0 - 4 });

            const [wireGate, wireInPorts, wireOutPorts] = this.gateStore.createWireEntity();
            wireGate.onGateAction = (gateState) => {
              wireObject.gateState = gateState;
            }
            wireObject.gateObject = wireGate;
            gateOutPorts[portIndex].appendChildren([wireInPorts[0]]);
            this.currentWireOutPort = wireOutPorts[0];

            this.bindWireGateObjectOnClickHandler(wireObject, wireGate);

            this.uiBuilder.uiCanvas.customHandlers.onMouseMove = (subEvent) => {
              subEvent.stopPropagation();
              const [x, y] = this.getPositionInCanvasFromEvent(subEvent);
              wireObject.applyStyles({ w: x - wireX, h: y - wireY });
              wireObject.outPort.applyStyles({ offsetX: x - wireX - 4, offsetY: y - wireY - 4 });
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
    gateCreator: () => [GateObjectShape, GatePortEntity[], GatePortEntity[]],
    onAfterCreate?: (object: UIGateObject, gate: GateObjectShape) => void,
  ) {
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
      object.gateObject = gate;

      this.bindGateObjectPortsHandlers(object.inPorts, object.outPorts, gateInPorts, gateOutPorts);
      if (onAfterCreate) {
        onAfterCreate(object, gate);
      }
    }
  }

  private enableSelectTool() {
    this.toolState = 'select';
    this.uiBuilder.uiCanvas.customHandlers.onClick = undefined;
  }

  private enableDeleteTool() {
    this.toolState = 'delete';
    this.uiBuilder.uiCanvas.customHandlers.onClick = undefined;
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
