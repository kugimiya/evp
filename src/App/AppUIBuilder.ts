import { Kernel } from "../Kernel/Kernel";
import { PrimitiveRect } from "../Kernel/UIEntities/PrimitiveRect";
import { UICanvas } from "../Kernel/UIEntities/UICanvas";
import { UIObjectShape } from "../Shapes/UIObjectShape";
import { UIObjectLayout } from "../Typings/UIObject";

export class AppUIBuilder {
  gateButtons: UIObjectShape[] = [];
  uiStateButtons: UIObjectShape[] = [];
  uiCanvas: UICanvas;
  buttonContainer: PrimitiveRect;

  sizes = {
    sidebar: 90,
    cellSize: 15,
  };

  constructor(private kernel: Kernel) {
    this.uiCanvas = this.kernel.uiObjectsStore.createUICanvas();
    this.uiCanvas.applyStyles({ x: this.sizes.sidebar, y: 0, w: 1920 - this.sizes.sidebar, h: 1080 });
    this.uiCanvas.cellSize = this.sizes.cellSize;
    this.buttonContainer = this.kernel.uiObjectsStore.createPrimitiveRectEntity();
  }

  buildUI() {
    this.buttonContainer.fillStyle = 'rgb(50, 50, 50)';
    this.buttonContainer.applyStyles({
      paddingY: 5,
      paddingX: 5,
      gapY: 5,
      w: this.sizes.sidebar,
      h: this.kernel.uiManager.height,
      x: 0,
      y: 0,
      layout: UIObjectLayout.FlexVertical,
    });

    const label1 = this.kernel.uiObjectsStore.createPrimitiveTextEntity();
    label1.text = 'logic gates:';
    label1.fontSize = 10;

    const label2 = this.kernel.uiObjectsStore.createPrimitiveTextEntity();
    label2.text = 'ui state:';
    label2.fontSize = 10;

    this.gateButtons = this.createGatesButtons();
    this.uiStateButtons = this.createUIStateButtons();

    this.buttonContainer.appendChildren([label1, ...this.gateButtons, label2, ...this.uiStateButtons]);
  }

  createGatesButtons() {
    const andButton = this.kernel.uiObjectsStore.createUIButton();
    andButton.textObject.text = 'AND';
    andButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    const notButton = this.kernel.uiObjectsStore.createUIButton();
    notButton.textObject.text = 'NOT';
    notButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    const orButton = this.kernel.uiObjectsStore.createUIButton();
    orButton.textObject.text = 'OR';
    orButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    const norButton = this.kernel.uiObjectsStore.createUIButton();
    norButton.textObject.text = 'NOR';
    norButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    const constButton = this.kernel.uiObjectsStore.createUIButton();
    constButton.textObject.text = 'CONST';
    constButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    return [andButton, notButton, orButton, norButton, constButton];
  };

  createUIStateButtons() {
    const selectButton = this.kernel.uiObjectsStore.createUIButton();
    selectButton.textObject.text = 'select';
    selectButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    const deleteButton = this.kernel.uiObjectsStore.createUIButton();
    deleteButton.textObject.text = 'delete';
    deleteButton.applyStyles({ w: this.sizes.sidebar - (this.buttonContainer.paddingX * 2) });

    return [selectButton, deleteButton];
  }
}
