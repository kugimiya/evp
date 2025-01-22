import { GateObjectsStore } from "../Kernel/Stores/GateObjectsStore";

const gatesStore = new GateObjectsStore();

// instance gates
const [and, andInPorts, andOutPorts] = gatesStore.createAndEntity();
const [obj1, obj1InPorts, obj1OutPorts] = gatesStore.createConstEntity();
const [obj2, obj2InPorts, obj2OutPorts] = gatesStore.createConstEntity();
const [obj1wireToAnd, obj1wireToAndInPorts, obj1wireToAndOutPorts] = gatesStore.createWireEntity();
const [obj2wireToAnd, obj2wireToAndInPorts, obj2wireToAndOutPorts] = gatesStore.createWireEntity();

// link them
obj1OutPorts[0].appendChildren(obj1wireToAndInPorts);
obj2OutPorts[0].appendChildren(obj2wireToAndInPorts);

obj1wireToAndOutPorts[0].appendChildren([andInPorts[0]]);
obj2wireToAndOutPorts[0].appendChildren([andInPorts[1]]);

// modify const gates states
obj1.value = 1;
obj2.value = 1;

// run sim
gatesStore.tick();

console.log('and.value =', and.value);
