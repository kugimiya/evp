import { ObjectId } from "../EntitiesInterfaces/IObject";

export type Port = [id: ObjectId, label: string, value: number | undefined];
export type PortId = ObjectId;