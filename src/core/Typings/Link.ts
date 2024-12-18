import { ObjectId } from "../Interfaces/IObject";
import { PortId } from "../Typings/Port";

export type Link = {
  out: {
    id: ObjectId;
    port: PortId;
  };

  in: {
    id: ObjectId;
    port: PortId;
  }[];
};
