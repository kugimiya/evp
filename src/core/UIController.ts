import { mouse } from "@kmamal/sdl";

import { Button } from "../ui/Button";
import { ButtonBox } from "../ui/ButtonBox";
import { MovableCanvas } from "../ui/MovableCanvas";
import { PrimitiveRect } from "../ui/PrimitiveRect";
import { UIConnector } from "./UIConnector";
import { LogicGate } from "../ui/LogicGate";
import { UIObject } from "../ui/UIObject";
import { Wire } from "../ui/Wire";
import { Wire as WireObj } from "../sim/PredefinedObjects/Wire";
import { Solver } from "../sim/Entities/Solver";
import { Or } from "../sim/PredefinedObjects/Or";
import { NotOr } from "../sim/PredefinedObjects/NotOr";
import { Not } from "../sim/PredefinedObjects/Not";
import { And } from "../sim/PredefinedObjects/And";
import { Const } from "../sim/PredefinedObjects/Const";

type ToolState = undefined | 'place' | 'move' | 'select' | 'toggle' | 'delete';
type PlaceToolState = undefined | 'andButton' | 'notButton' | 'orButton' | 'notOrButton' | 'constButton' | 'wireButton';

export class UIController {
  tool: ToolState = undefined;
  placeToolValue: PlaceToolState = undefined;

  canvasMouseDown = false;

  wirePlacing = {
    state: false,
    postState: false,
    wire: undefined as undefined | Wire,
    wireObj: undefined as undefined | WireObj,
  };

  gatePlacing = {
    state: false,
    gate: undefined as undefined | LogicGate
  };

  canvasOffsetX = 0;
  canvasOffsetY = 0;

  canvas: MovableCanvas;

  logicGates: UIObject[] = [];

  rootWire: WireObj;

  constructor(private ui: UIConnector, private solver: Solver) {
    this.canvas = new MovableCanvas('cnv', 'rgba(25, 25, 25, 255)', 'rgba(255, 255, 255, 0.35)', 95, 25, this.ui.width - 120, this.ui.height - 50, this.ui.ctx);
    this.rootWire = solver.addObjectWire(this.canvas);
  }

  spawnToolbar(): void {
    const buttonBox  = new ButtonBox('bb', 0, 0, 70, this.ui.height, this.ui.ctx);
    buttonBox.paddingX = 5;
    buttonBox.paddingY = 5;

    const andButton = new Button('andButton', 'AND', 0, 0, 60, 30, this.ui.ctx);
    andButton.customHandlers.onClick = () => this.setPlaceToolValue('andButton');

    const notButton = new Button('notButton', 'NOT', 0, 35, 60, 30, this.ui.ctx);
    notButton.customHandlers.onClick = () => this.setPlaceToolValue('notButton');

    const orButton = new Button('orButton', 'OR', 0, 70, 60, 30, this.ui.ctx);
    orButton.customHandlers.onClick = () => this.setPlaceToolValue('orButton');

    const notOrButton = new Button('notOrButton', 'NOR', 0, 105, 60, 30, this.ui.ctx);
    notOrButton.customHandlers.onClick = () => this.setPlaceToolValue('notOrButton');

    const constButton = new Button('constButton', 'CONST', 0, 140, 60, 30, this.ui.ctx);
    constButton.customHandlers.onClick = () => this.setPlaceToolValue('constButton');

    const wireButton = new Button('wireButton', 'WIRE', 0, 175, 60, 30, this.ui.ctx);
    wireButton.customHandlers.onClick = () => this.setPlaceToolValue('wireButton');

    const moveButton = new Button('toolMoveButton', 'move', 0, 230, 60, 30, this.ui.ctx);
    moveButton.customHandlers.onClick = () => this.setTool('move');

    const selectButton = new Button('toolSelectButton', 'select', 0, 265, 60, 30, this.ui.ctx);
    selectButton.customHandlers.onClick = () => this.setTool('select');

    const simStepButton = new Button('toolToggleButton', 'play', 0, 300, 60, 30, this.ui.ctx);
    simStepButton.customHandlers.onClick = () => this.solver.step(this.rootWire.id);

    const deleteButton = new Button('toolDeleteButton', 'delete', 0, 335, 60, 30, this.ui.ctx);
    deleteButton.customHandlers.onClick = () => this.setTool('delete');

    buttonBox.appendChildren([
      andButton,
      notButton,
      orButton,
      notOrButton,
      constButton,
      // wireButton,

      moveButton,
      selectButton,
      simStepButton,
      // deleteButton
    ]);

    this.ui.registerUIObject(buttonBox);
  }

  spawnBackground(): void {
    const background = new PrimitiveRect('bg', 'rgba(0, 0, 0, 255)', 0, 0, this.ui.width, this.ui.height, this.ui.ctx);
    this.ui.registerUIObject(background);
  }

  spawnWire(x: number, y: number) {
    this.tool = 'place';
    this.placeToolValue = 'wireButton';
    const wire = new Wire(
      `wire-${Date.now()}`,
      x,
      y,
      this.ui.ctx,
      (x: number, y: number) => {
        console.warn('wire input clicked, but this behavior is unhandled');
      },
      (x: number, y: number) => {
        if (this.wirePlacing.postState === false) {
          setTimeout(() => {
            const prevWireObj = this.wirePlacing.wireObj;
            const wireObj = this.spawnWire(x, y);

            if (prevWireObj) {
              this.solver.linker.registerLink({
                in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                out: { id: prevWireObj.id, port: prevWireObj.outPorts[0][0] },
              });
            }
          }, 20);
        }
      },
    );
    const wireObj = this.solver.addObjectWire(wire);
    this.wirePlacing.wireObj = wireObj;
    this.wirePlacing.state = true;
    this.wirePlacing.postState = true;
    this.logicGates.push(wire);
    this.ui.registerUIObject(wire);
    this.canvas.appendChildren([wire]);
    this.wirePlacing.wire = wire;
    return wireObj;
  }

  spawnCanvas(): void {
    this.ui.registerUIObject(this.canvas);

    this.canvas.customHandlers.onClick = (button, x, y) => {
      if (this.placeToolValue === 'wireButton') {
        if (this.wirePlacing.state) {
          this.wirePlacing.state = false;
          this.setTool(undefined);
          setTimeout(() => {
            this.wirePlacing.postState = false;
            if (this.wirePlacing.wire) {
              this.wirePlacing.wire.applyCbs();
            }
          }, 50);
        } else {
          this.spawnWire(x, y);
        }
      }

      if (this.placeToolValue !== 'wireButton' && this.placeToolValue !== undefined) {
        if (this.gatePlacing.state) {
          this.gatePlacing.state = false;
        }
      }

      if (this.placeToolValue !== undefined) {
        this.ui.buildGraph();
      }
    }

    this.canvas.customHandlers.onHover = () => {
      if (this.tool === 'move') {
        mouse.setCursor('sizeall');
      }
    };

    this.canvas.customHandlers.onBlur = () => {
      mouse.setCursor('arrow');
    }

    this.canvas.customHandlers.onMouseDown = () => {
      this.canvasMouseDown = true;
    }

    this.canvas.customHandlers.onMouseUp = () => {
      this.canvasMouseDown = false;
    }

    this.canvas.customHandlers.onMouseMove = (x, y, offsetX, offsetY) => {
      if (this.placeToolValue === 'wireButton' && this.wirePlacing.state) {
        if (this.wirePlacing.wire) {
          this.wirePlacing.wire.x1 = x;
          this.wirePlacing.wire.y1 = y;

          this.wirePlacing.wire.outPort.offsetX = x - 2.5;
          this.wirePlacing.wire.outPort.offsetY = y - 2.5;
        }
      }

      if (this.placeToolValue !== 'wireButton' && this.placeToolValue !== undefined && this.gatePlacing.state) {
        if (this.gatePlacing.gate) {
          this.gatePlacing.gate.applyCoords(x, y);
        }
      }

      if (this.tool === 'move' && this.canvasMouseDown) {
        this.canvas.offsetX += offsetX;
        this.canvas.offsetY += offsetY;

        this.logicGates.forEach((item) => {
          (item as LogicGate).applyOffset(offsetX, offsetY);
        });
      }
    }
  }

  setTool(tool: ToolState): void {
    this.placeToolValue = undefined;
    this.tool = tool;
  }

  setPlaceToolValue(tool: PlaceToolState): void {
    this.placeToolValue = tool;
    this.tool = 'place';

    if (this.placeToolValue !== undefined) {
      if (this.gatePlacing.state && this.gatePlacing.gate !== undefined) {
        const gateId = this.gatePlacing.gate.id;
        this.logicGates = this.logicGates.filter((gate) => gate.id !== gateId);
        this.canvas.children = this.canvas.children.filter((item) => item.id !== gateId);
        this.ui.uiObjects = this.ui.uiObjects.filter((item) => item.id !== gateId);
        this.gatePlacing.gate = undefined;
        this.ui.buildGraph();
      }

      let gate: LogicGate | undefined = undefined;

      if (this.placeToolValue === 'andButton') {
        let gateObj: And;

        gate = new LogicGate(`and-gate-${Date.now()}`, 'AND', 2, 1, 0, 0, this.ui.ctx, (inPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.outPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }
                });
              }
            }, 20);
          } else {
            if (this.wirePlacing.wireObj) {
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }],
                  out: { id: this.wirePlacing.wireObj.id, port: this.wirePlacing.wireObj.outPorts[0][0] }
                });
              }
            }
          }
        }, (outPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.outPorts[outPortNum][0] },
                });
              }
            }, 20);
          }
        });

        gateObj = this.solver.addObjectAnd(gate);
      }

      if (this.placeToolValue === 'orButton') {
        let gateObj: Or;

        gate = new LogicGate(`or-gate-${Date.now()}`, 'OR', 2, 1, 0, 0, this.ui.ctx, (inPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.outPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }
                });
              }
            }, 20);
          } else {
            if (this.wirePlacing.wireObj) {
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }],
                  out: { id: this.wirePlacing.wireObj.id, port: this.wirePlacing.wireObj.outPorts[0][0] }
                });
              }
            }
          }
        }, (outPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.outPorts[outPortNum][0] },
                });
              }
            }, 20);
          }
        });

        gateObj = this.solver.addObjectOr(gate);
      }

      if (this.placeToolValue === 'notButton') {
        let gateObj: Not;

        gate = new LogicGate(`not-gate-${Date.now()}`, 'NOT', 1, 1, 0, 0, this.ui.ctx, (inPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.outPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }
                });
              }
            }, 20);
          } else {
            if (this.wirePlacing.wireObj) {
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }],
                  out: { id: this.wirePlacing.wireObj.id, port: this.wirePlacing.wireObj.outPorts[0][0] }
                });
              }
            }
          }
        }, (outPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.outPorts[outPortNum][0] },
                });
              }
            }, 20);
          }
        });

        gateObj = this.solver.addObjectNot(gate);
      }

      if (this.placeToolValue === 'notOrButton') {
        let gateObj: NotOr;

        gate = new LogicGate(`nor-gate-${Date.now()}`, 'NOR', 2, 1, 0, 0, this.ui.ctx, (inPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.outPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }
                });
              }
            }, 20);
          } else {
            if (this.wirePlacing.wireObj) {
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }],
                  out: { id: this.wirePlacing.wireObj.id, port: this.wirePlacing.wireObj.outPorts[0][0] }
                });
              }
            }
          }
        }, (outPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.outPorts[outPortNum][0] },
                });
              }
            }, 20);
          }
        });

        gateObj = this.solver.addObjectNotOr(gate);
      }

      if (this.placeToolValue === 'constButton') {
        let gateObj: Const;

        gate = new LogicGate(`const-gate-${Date.now()}`, 'CONST', 0, 1, 0, 0, this.ui.ctx, (inPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.outPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }
                });
              }
            }, 20);
          } else {
            if (this.wirePlacing.wireObj) {
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: gateObj.id, port: gateObj.inPorts[inPortNum][0] }],
                  out: { id: this.wirePlacing.wireObj.id, port: this.wirePlacing.wireObj.outPorts[0][0] }
                });
              }
            }
          }
        }, (outPortNum, x, y) => {
          if (this.wirePlacing.postState === false) {
            setTimeout(() => {
              const wireObj = this.spawnWire(x, y);
              if (gateObj) {
                this.solver.linker.registerLink({
                  in: [{ id: wireObj.id, port: wireObj.inPorts[0][0] }],
                  out: { id: gateObj.id, port: gateObj.outPorts[outPortNum][0] },
                });
              }
            }, 20);
          }
        });

        gateObj = this.solver.addObjectConst(0, gate);
        this.solver.linker.registerLink({
          in: [{ id: gateObj.id, port: gateObj.inPorts[0][0] }],
          out: { id: this.rootWire.id, port: this.rootWire.outPorts[0][0] },
        });

        gate.gateType = 'const';
        gate.hoverable = true;
        gate.gateState = 0;
        gate.customHandlers.onClick = () => {
          if (gate) {
            gate.gateState = Number(!gate.gateState);
            gateObj.outPorts[0][2] = Number(gate.gateState);
          }
        }
      }

      if (gate) {
        this.logicGates.push(gate);
        this.ui.registerUIObject(gate);
        this.canvas.appendChildren([gate]);

        this.gatePlacing.state = true;
        this.gatePlacing.gate = gate;
      }
    }
  }
}
