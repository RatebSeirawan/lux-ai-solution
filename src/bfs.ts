import { logger } from "./logger";
import { Cell } from "./lux";

type Coord = [number, number];
type Validation = (cell: Cell) => boolean;

const successors = (
  root: Coord,
  m: Cell[][],
  from: Coord,
  d: number,
  validation?: Validation
) => {
  const connectedCells = [
    [root[0] - 1, root[1]],
    [root[0], root[1] - 1],
    [root[0] + 1, root[1]],
    [root[0], root[1] + 1],
  ];

  const validCells = connectedCells.filter((cell) => {
    const v =
      cell[0] >= 0 &&
      cell[0] < m.length &&
      cell[1] >= 0 &&
      cell[1] < m[0].length;

    if (!v) return false;

    const v2 =
      Math.abs(cell[0] - from[0]) <= d && Math.abs(cell[1] - from[1]) <= d;

    if (!v2) return false;

    if (validation) {
      return validation(m[cell[1]][cell[0]]);
    }

    return true;
  });

  return validCells;
};

const buildPath = (traversalTree, to: Coord) => {
  const path = [to];
  // @ts-ignore
  let parent = traversalTree[to];
  while (parent) {
    path.push(parent);
    parent = traversalTree[parent];
  }
  return path.reverse();
};

export const bfs = (
  m: Cell[][],
  from: Coord,
  to: Coord,
  validation?: Validation
) => {
  if (from === to) return null;

  const d = Math.max(Math.abs(from[0] - to[0]), Math.abs(from[1] - to[1]));

  const traversalTree = [];
  const visited = new Set();
  const queue = [];
  queue.push(from);

  while (queue.length) {
    const subtreeRoot = queue.shift();
    visited.add(subtreeRoot.toString());

    if (subtreeRoot.toString() === to.toString()) {
      return buildPath(traversalTree, to);
    }

    for (const child of successors(subtreeRoot, m, from, d, validation)) {
      if (!visited.has(child.toString())) {
        // @ts-ignore
        traversalTree[child] = subtreeRoot;
        queue.push(child);
      }
    }
  }
};
