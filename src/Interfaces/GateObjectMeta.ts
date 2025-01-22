import { GateObjectPort } from "../Typings/GateObjectPort";

export type GetPortsReturn = [inPorts: GateObjectPort[], outPorts: GateObjectPort[]];

export interface GateObjectMeta {
  label: string;
  value: undefined | number;
  action(): boolean;
  getPorts(): GetPortsReturn;
}
