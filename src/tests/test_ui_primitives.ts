import { Kernel } from "../Kernel/Kernel";
import { UIObjectLayout, UIObjectPosition } from "../Typings/UIObject";

const kernel = new Kernel([800, 800, "Test primitives"]);

// just text in rect
const rect1 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect1.w = 250;
rect1.h = 100;
rect1.paddingX = 5;
rect1.paddingY = 5;
rect1.fillStyle = 'rgb(150, 150, 150)';
rect1.position = UIObjectPosition.Relative;

const text1 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text1.text = 'Hello, world!';
text1.position = UIObjectPosition.Relative;

rect1.appendChildren([text1]);

// centered text in rect
const rect2 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect2.w = 250;
rect2.h = 100;
rect2.paddingX = 5;
rect2.paddingY = 5;
rect2.fillStyle = 'rgb(150, 150, 150)';
rect2.position = UIObjectPosition.Relative;
rect2.layout = UIObjectLayout.Centered;

const text2 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text2.text = 'Hello, world!';
text2.position = UIObjectPosition.Relative;

rect2.appendChildren([text2]);

// flexed horizontal texts in rect
const rect3 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect3.w = 250;
rect3.h = 100;
rect3.paddingX = 5;
rect3.paddingY = 5;
rect3.fillStyle = 'rgb(150, 150, 150)';
rect3.position = UIObjectPosition.Relative;
rect3.layout = UIObjectLayout.FlexHorizontal;
rect3.gapX = 15;

const text3 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text3.text = 'hor1';
text3.position = UIObjectPosition.Relative;

const text4 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text4.text = 'hor2';
text4.position = UIObjectPosition.Relative;

rect3.appendChildren([text3, text4]);

// flexed vertical texts in rect
const rect4 = kernel.uiObjectsStore.createPrimitiveRectEntity();
rect4.w = 250;
rect4.h = 100;
rect4.paddingX = 5;
rect4.paddingY = 5;
rect4.fillStyle = 'rgb(150, 150, 150)';
rect4.position = UIObjectPosition.Relative;
rect4.layout = UIObjectLayout.FlexVertical;
rect4.gapY = 15;

const text5 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text5.text = 'ver1';
text5.position = UIObjectPosition.Relative;

const text6 = kernel.uiObjectsStore.createPrimitiveTextEntity();
text6.text = 'ver2';
text6.position = UIObjectPosition.Relative;

rect4.appendChildren([text5, text6]);

const line = kernel.uiObjectsStore.createPrimitiveLineEntity();
line.applyStyles({ x: 10, y: 10, w: 100, h: 100 });
line.fillStyle = 'white';
line.lineWidth = 3;

// container
const rectContainer = kernel.uiObjectsStore.createPrimitiveRectEntity();
rectContainer.paddingX = 10;
rectContainer.paddingY = 10;
rectContainer.fillStyle = 'rgb(50, 50, 50)';
rectContainer.x = 50;
rectContainer.y = 50;
rectContainer.w = 700;
rectContainer.h = 700;
rectContainer.layout = UIObjectLayout.FlexVertical;
rectContainer.gapY = 10;

rectContainer.appendChildren([rect1, rect2, rect3, rect4, line]);

kernel.loop();
