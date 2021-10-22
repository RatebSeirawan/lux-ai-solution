import { Agent } from "./lux";
import { getResouceTiles, getWorkers } from "./actions";
import { Worker } from "./actors";

import { logger } from "./logger";

const agent = new Agent();

agent.run(({ id, players, map: gameMap, turn }) => {
  const actions = new Array<string>();

  logger.setTurn(turn);

  const player = players[id];
  // const opponent = players[(id + 1) % 2];

  const resourceTiles = getResouceTiles(gameMap);

  getWorkers(player.units).forEach((unit, i) => {
    const worker = new Worker(
      unit,
      resourceTiles,
      player.cities,
      gameMap,
      player.researchedCoal() && i < 3 ? "coal" : "wood",
      turn
    );

    const workerStrategy = () => {
      if (worker.hasBuildResouces()) {
        const temp = worker.goToBuildingTile();

        if (temp) return temp;
      }

      if (worker.hasSpace) {
        return worker.goToClosestResourceTile();
      } else {
        return worker.goToClosestCity();
      }
    };

    const action = workerStrategy();

    logger.unit(unit, action);
    if (unit.canAct()) {
      actions.push(action);
    }
  });

  Array.from(player.cities).forEach(([, city]) => {
    let newUnits = 0;
    city.citytiles.forEach((c) => {
      if (c.canAct()) {
        if (player.units.length + newUnits < player.cityTileCount) {
          actions.push(c.buildWorker());
          newUnits += 1;
        } else {
          if (player.researchPoints < 50) {
            actions.push(c.research());
          }
        }
      }
    });
  });

  return actions;
});
