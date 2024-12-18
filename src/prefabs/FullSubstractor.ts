import { BaseObject } from "../core/Entities/BaseObject";
import { Solver } from "../core/Entities/Solver";

type SemiSubtractorIO = [
  a_wire: BaseObject,
  b_wire: BaseObject,
  in2_wire: BaseObject,
  out1_wire: BaseObject,
  out2_wire: BaseObject,
];

export const createFullSubtractor = (solver: Solver) => {
  const rootWire = solver.addObjectWire();

  // create operands
  const operandAIO = createInput([1, 1, 1, 1, 1, 1, 1, 1], solver, rootWire);
  const operandBIO = createInput([0, 0, 0, 0, 0, 0, 0, 1], solver, rootWire);

  // create output
  const operandCIO = createOutput([0, 0, 0, 0, 0, 0, 0, 0], solver);

  // create semi summators
  const semiSubtractor0IO = createSemiSubtractor(solver);
  const semiSubtractor1IO = createSemiSubtractor(solver);
  const semiSubtractor2IO = createSemiSubtractor(solver);
  const semiSubtractor3IO = createSemiSubtractor(solver);
  const semiSubtractor4IO = createSemiSubtractor(solver);
  const semiSubtractor5IO = createSemiSubtractor(solver);
  const semiSubtractor6IO = createSemiSubtractor(solver);
  const semiSubtractor7IO = createSemiSubtractor(solver);

  // link them with operands
  linkSemiSubtractorsWithOperands(semiSubtractor0IO, operandAIO, operandBIO, operandCIO, 0, 7, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor1IO, operandAIO, operandBIO, operandCIO, 1, 6, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor2IO, operandAIO, operandBIO, operandCIO, 2, 5, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor3IO, operandAIO, operandBIO, operandCIO, 3, 4, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor4IO, operandAIO, operandBIO, operandCIO, 4, 3, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor5IO, operandAIO, operandBIO, operandCIO, 5, 2, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor6IO, operandAIO, operandBIO, operandCIO, 6, 1, solver);
  linkSemiSubtractorsWithOperands(semiSubtractor7IO, operandAIO, operandBIO, operandCIO, 7, 0, solver);

  // then links themselfs
  linkSemiSubtractorsWithSelfs(semiSubtractor0IO, semiSubtractor1IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor1IO, semiSubtractor2IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor2IO, semiSubtractor3IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor3IO, semiSubtractor4IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor4IO, semiSubtractor5IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor5IO, semiSubtractor6IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor6IO, semiSubtractor7IO, solver);
  linkSemiSubtractorsWithSelfs(semiSubtractor7IO, semiSubtractor0IO, solver);

  return { rootWire, operandAIO, operandBIO, operandCIO };
};

const createInput = (
  values: number[],
  solver: Solver,
  rootWire: BaseObject,
): BaseObject[] => {
  return values.map((value) => {
    const object = solver.addObjectConst(value);
    solver.linker.registerLink({
      in: [{ id: object.id, port: object.inPorts[0][0] }],
      out: { id: rootWire.id, port: rootWire.outPorts[0][0] },
    });
    return object;
  });
};

const createOutput = (values: number[], solver: Solver): BaseObject[] => {
  return values.map(() => {
    const object = solver.addObjectWire();
    return object;
  });
};

const createSemiSubtractor = (solver: Solver): SemiSubtractorIO => {
  // create io wires
  const a_wire = solver.addObjectWire();
  const b_wire = solver.addObjectWire();
  const in2_wire = solver.addObjectWire();
  const out1_wire = solver.addObjectWire();
  const out2_wire = solver.addObjectWire();

  // create "first row" of logic gates and link with io wires
  const nor1 = solver.addObjectNotOr();
  const and1 = solver.addObjectAnd();

  solver.linker.registerLink({
    in: [
      { id: nor1.id, port: nor1.inPorts[1][0] },
      { id: and1.id, port: and1.inPorts[0][0] },
    ],
    out: { id: a_wire.id, port: a_wire.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [
      { id: nor1.id, port: nor1.inPorts[0][0] },
      { id: and1.id, port: and1.inPorts[1][0] },
    ],
    out: { id: b_wire.id, port: b_wire.outPorts[0][0] },
  });

  // create "second row" of logic gates and link with "prev row" and io wires
  const nor2 = solver.addObjectNotOr();
  const and2 = solver.addObjectAnd();

  solver.linker.registerLink({
    in: [
      { id: nor2.id, port: nor2.inPorts[0][0] },
      { id: and2.id, port: and2.inPorts[0][0] },
    ],
    out: { id: in2_wire.id, port: in2_wire.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [
      { id: nor2.id, port: nor2.inPorts[1][0] },
      { id: and2.id, port: and2.inPorts[1][0] },
    ],
    out: { id: nor1.id, port: nor1.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [{ id: out1_wire.id, port: out1_wire.inPorts[0][0] }],
    out: { id: nor2.id, port: nor2.outPorts[0][0] },
  });

  // create "third row" of logic gates and link with "prev row" and io wires
  const or3 = solver.addObjectOr();

  solver.linker.registerLink({
    in: [{ id: or3.id, port: or3.inPorts[0][0] }],
    out: { id: and2.id, port: and2.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [{ id: or3.id, port: or3.inPorts[1][0] }],
    out: { id: and1.id, port: and1.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [{ id: out2_wire.id, port: out2_wire.inPorts[0][0] }],
    out: { id: or3.id, port: or3.outPorts[0][0] },
  });

  return [a_wire, b_wire, in2_wire, out1_wire, out2_wire];
};

const linkSemiSubtractorsWithOperands = (
  semiSubtractorIO: SemiSubtractorIO,
  operandAIO: BaseObject[],
  operandBIO: BaseObject[],
  operandCIO: BaseObject[],
  inputBitIndex: number,
  outputBitIndex: number,
  solver: Solver,
): void => {
  const [operandA, operandB, operandC] = [
    operandAIO[inputBitIndex],
    operandBIO[inputBitIndex],
    operandCIO[outputBitIndex],
  ];
  const [aWire, bWire, out1Wire] = [
    semiSubtractorIO[0],
    semiSubtractorIO[1],
    semiSubtractorIO[3],
  ];

  solver.linker.registerLink({
    in: [{ id: aWire.id, port: aWire.inPorts[0][0] }],
    out: { id: operandA.id, port: operandA.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [{ id: bWire.id, port: bWire.inPorts[0][0] }],
    out: { id: operandB.id, port: operandB.outPorts[0][0] },
  });

  solver.linker.registerLink({
    in: [{ id: operandC.id, port: operandC.inPorts[0][0] }],
    out: { id: out1Wire.id, port: out1Wire.outPorts[0][0] },
  });
};

const linkSemiSubtractorsWithSelfs = (
  semiSubtractorAIO: SemiSubtractorIO,
  semiSubtractorBIO: SemiSubtractorIO,
  solver: Solver,
): void => {
  const [out2WireA, in2WireB] = [semiSubtractorAIO[4], semiSubtractorBIO[2]];
  solver.linker.registerLink({
    in: [{ id: in2WireB.id, port: in2WireB.inPorts[0][0] }],
    out: { id: out2WireA.id, port: out2WireA.outPorts[0][0] },
  });
};