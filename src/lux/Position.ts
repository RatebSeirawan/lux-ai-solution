import GAME_CONSTANTS from "./game_constants";
const { DIRECTIONS } = GAME_CONSTANTS;

type Directions = "n" | "w" | "e" | "s" | "c";

export class Position {
  public x: number;
  public y: number;
  private checkDirections = [
    DIRECTIONS.NORTH,
    DIRECTIONS.EAST,
    DIRECTIONS.SOUTH,
    DIRECTIONS.WEST,
  ];

  private checkDirectionsDiagonal = [
    ...this.checkDirections,
    DIRECTIONS.NORTH_WEST,
    DIRECTIONS.NORTH_EAST,
    DIRECTIONS.SOUTH_WEST,
    DIRECTIONS.SOUTH_EAST,
  ];

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isAdjacent(pos: Position): boolean {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    return Math.abs(dx) + Math.abs(dy) <= 1;
  }

  public equals(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y;
  }

  public translate(direction: string, units: number = 1): Position {
    switch (direction) {
      case DIRECTIONS.NORTH:
        return new Position(this.x, this.y - units);
      case DIRECTIONS.EAST:
        return new Position(this.x + units, this.y);
      case DIRECTIONS.SOUTH:
        return new Position(this.x, this.y + units);
      case DIRECTIONS.WEST:
        return new Position(this.x - units, this.y);
      case DIRECTIONS.CENTER:
        return new Position(this.x, this.y);

      case DIRECTIONS.SOUTH_EAST:
        return new Position(this.x + units, this.y + units);
      case DIRECTIONS.SOUTH_WEST:
        return new Position(this.x - units, this.y + units);
      case DIRECTIONS.NORTH_EAST:
        return new Position(this.x + 1, this.y - units);
      case DIRECTIONS.NORTH_WEST:
        return new Position(this.x - 1, this.y - units);
    }
  }

  public translateAll(size: number, units: number = 1): Position[] {
    return this.checkDirections
      .map((dir) => {
        return this.translate(dir, units);
      })
      .filter((e) => {
        return e.x < size && e.x >= 0 && e.y < size && e.y >= 0;
      });
  }

  /** Returns Manhattan distance to pos from this position */
  public distanceTo(pos: Position): number {
    return Math.abs(pos.x - this.x) + Math.abs(pos.y - this.y);
  }

  /** Returns closest direction to targetPos, or null if staying put is best */
  public directionTo(targetPos: Position): Directions {
    let closestDirection = DIRECTIONS.CENTER;
    let closestDist = this.distanceTo(targetPos);
    this.checkDirections.forEach((dir) => {
      const newpos = this.translate(dir, 1);
      const dist = targetPos.distanceTo(newpos);
      if (dist < closestDist) {
        closestDist = dist;
        closestDirection = dir;
      }
    });
    return closestDirection as Directions;
  }
}
