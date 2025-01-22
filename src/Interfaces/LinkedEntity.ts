export interface LinkedEntity {
  id: string;
  childrenIds: string[];

  appendChildren(children: LinkedEntity[]): void;
}
