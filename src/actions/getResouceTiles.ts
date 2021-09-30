import { Cell, GameMap } from "../lux";

export const getResouceTiles = (gameMap: GameMap): Cell[] => {
  const resourceTiles: Array<Cell> = [];

  for (let y = 0; y < gameMap.height; y++) {
    for (let x = 0; x < gameMap.width; x++) {
      const cell = gameMap.getCell(x, y);
      if (cell.hasResource()) {
        resourceTiles.push(cell);
      }
    }
  }

  return resourceTiles;
};
