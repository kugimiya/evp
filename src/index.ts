import { Solver } from "./core/Entities/Solver";
import { createFullSubtractor } from "./prefabs/FullSubstractor";

const solver = new Solver();
const { rootWire, operandAIO, operandBIO, operandCIO } = createFullSubtractor(
  solver,
  32,
);

const time = Date.now();
solver.step(rootWire.id);
console.log(`MAIN: step time = ${Date.now() - time}ms`);
console.log(
  `MAIN: simulated objects = ${Object.keys(solver.linker.objects).length}, with links count = ${solver.linker.links.length}`,
);
console.log(
  "[in]  A =",
  operandAIO.map((object) => object.outPorts[0][2]).join(""),
);
console.log(
  "[in]  B =",
  operandBIO.map((object) => object.outPorts[0][2]).join(""),
);
console.log(
  "[out] C =",
  operandCIO.map((object) => object.outPorts[0][2]).join(""),
);
