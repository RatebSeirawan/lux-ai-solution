import { bfs } from "../bfs";
import { logger } from "../logger";
import { Cell, ResourceType } from "./Cell";
import { Position } from "./Position";

export class GameMap {
  public width: number;
  public height: number;
  public map: Array<Array<Cell>>;

  public constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.map = new Array(this.height);

    for (let y = 0; y < this.height; y++) {
      this.map[y] = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = new Cell(x, y);
      }
    }
  }

  public shortestPath(from: Position, to: Position) {
    const shortestPath = bfs(
      this.map,
      [from.x, from.y],
      [to.x, to.y],
      (c) => !c.taken && !c.citytile
    );

    if (!shortestPath || shortestPath.length <= 1) return null;
    return shortestPath[1];
  }

  public getCellByPos(pos: Position): Cell {
    return this.map[pos.y][pos.x];
  }

  public getCell(x: number, y: number): Cell {
    return this.map[y][x];
  }

  public isTaken(pos: Position): boolean {
    return this.map[pos.y][pos.x].taken;
  }

  public setTaken(pos: Position): void {
    this.map[pos.y][pos.x].taken = true;
  }

  public isEmpty(pos: Position) {
    const tile = this.getCellByPos(pos);
    return !tile.hasResource() && !tile.citytile;
  }

  public _setResource(
    type: ResourceType,
    x: number,
    y: number,
    amount: number
  ): void {
    const cell = this.getCell(x, y);
    cell.resource = {
      type,
      amount,
    };
  }
}
