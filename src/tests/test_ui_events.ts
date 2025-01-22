import { Kernel } from "../Kernel/Kernel";
import { UIObjectPosition } from "../Typings/UIObject";

const kernel = new Kernel([400, 400, "Test eventing"]);

let eventsFired = 0;

const rect1 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect1.applyStyles({
  x: 50, y: 50,
  w: 250, h: 100,
  paddingX: 5, paddingY: 5,
  position: UIObjectPosition.Relative,
});
rect1.fillStyle = 'rgb(50, 50, 50)';
rect1.fillStyleHovered = 'rgb(25, 50, 50)';
rect1.customHandlers.onClick = () => {
  console.log('click rect1', eventsFired);
  eventsFired += 1;
};
rect1.customHandlers.onMouseMove = () => {
  console.log('rect1 mouse move', eventsFired);
  eventsFired += 1;
};

const rect2 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect2.applyStyles({
  w: 200, h: 80,
  paddingX: 5, paddingY: 5,
  position: UIObjectPosition.Relative,
});
rect2.fillStyle = 'rgb(100, 100, 100)';
rect2.fillStyleHovered = 'rgb(50, 100, 100)';
rect2.customHandlers.onClick = () => {
  console.log('click rect2', eventsFired);
  eventsFired += 1;
};
rect2.customHandlers.onMouseMove = () => {
  console.log('rect2 mouse move', eventsFired);
  eventsFired += 1;
};

const rect3 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect3.applyStyles({
  w: 160, h: 60,
  paddingX: 5, paddingY: 5,
  position: UIObjectPosition.Relative,
});
rect3.fillStyle = 'rgb(150, 150, 150)';
rect3.fillStyleHovered = 'rgb(50, 150, 150)';
rect3.isHoverableCursor = true;
rect3.customHandlers.onClick = (event) => {
  console.log('click rect3', eventsFired);
  eventsFired += 1;
  event.stopPropagation();
};
rect3.customHandlers.onMouseMove = (event) => {
  console.log('rect3 mouse move', eventsFired);
  eventsFired += 1;
  event.stopPropagation();
};

rect2.appendChildren([rect3]);
rect1.appendChildren([rect2]);

kernel.loop();
