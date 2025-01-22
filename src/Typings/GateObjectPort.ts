export enum GateObjectPortType {
  InPort = 0,
  OutPort = 1,
};

export type GateObjectPort = [gateObjectId: string, value: number | undefined, type: GateObjectPortType];
