import { Solver } from "./core/Entities/Solver";

const solver = new Solver();

const not1 = solver.addObjectNot();
const not2 = solver.addObjectNot();
const not3 = solver.addObjectNot();

solver.linker.registerLink({
  out: {
    id: not1.id,
    port: not1.outPorts[0][0],
  },
  in: [
    { id: not2.id, port: not2.inPorts[0][0] },
  ],
});

solver.linker.registerLink({
  out: {
    id: not2.id,
    port: not2.outPorts[0][0],
  },
  in: [
    { id: not3.id, port: not3.inPorts[0][0] },
  ],
});

solver.linker.registerLink({
  out: {
    id: not3.id,
    port: not3.outPorts[0][0],
  },
  in: [
    { id: not1.id, port: not1.inPorts[0][0] },
  ],
});

const time = Date.now();
solver.step(not1.id);
console.log(`MAIN: step time = ${Date.now() - time}ms`);
