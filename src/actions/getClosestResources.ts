import { Cell, Position, ResourceType } from "../lux";

export const getClosestResources = (
  cells: Cell[],
  pos: Position,
  type: ResourceType = "wood"
): Cell[] => {
  return cells
    .filter((cell) => cell.resource.type === type && !cell.taken)
    .sort((a, b) => {
      const distA = a.pos.distanceTo(pos);
      const distB = b.pos.distanceTo(pos);

      return distA - distB;
    });
};
