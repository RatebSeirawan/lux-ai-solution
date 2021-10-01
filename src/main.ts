import { Agent, GameState } from "./lux";
import { getAvailableWorks, getResouceTiles } from "./actions";
import { Worker } from "./actors";

const agent = new Agent();
agent.run((gameState: GameState): Array<string> => {
  const actions = new Array<string>();

  const { id, players, map: gameMap, turn } = gameState;

  const player = players[id];
  // const opponent = players[(id + 1) % 2];

  const resourceTiles = getResouceTiles(gameMap);

  getAvailableWorks(player.units).forEach((unit) => {
    const worker = new Worker(unit, resourceTiles, player.cities, turn);

    if (worker.hasSpace) {
      actions.push(worker.goToClosestResourceTile());
    } else {
      actions.push(worker.goToClosestCity());
    }
  });

  return actions;
});
