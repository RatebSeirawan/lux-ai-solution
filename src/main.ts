import { Agent, GameState, Cell, City, CityTile, CONSTANTS } from "./lux";
import { getResouceTiles } from "./actions";

// any state can be stored between ticks by defining variable here
// note that game objects are recreated every tick so make sure to update them

const agent = new Agent();
// agent.run takes care of running your code per tick
agent.run((gameState: GameState): Array<string> => {
  const actions = new Array<string>();

  const { id, players, map: gameMap, turn } = gameState;

  const player = players[id];
  // const opponent = players[(id + 1) % 2];

  const resourceTiles = getResouceTiles(gameMap);

  // we iterate over all our units and do something with them
  for (let i = 0; i < player.units.length; i++) {
    const unit = player.units[i];

    if (unit.isWorker() && unit.canAct()) {
      if (unit.getCargoSpaceLeft() > 0) {
        // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
        let closestResourceTile: Cell = null;
        let closestDist = 9999999;
        resourceTiles.forEach((cell) => {
          if (
            cell.resource.type === CONSTANTS.RESOURCE_TYPES.COAL &&
            !player.researchedCoal()
          )
            return;
          if (
            cell.resource.type === CONSTANTS.RESOURCE_TYPES.URANIUM &&
            !player.researchedUranium()
          )
            return;
          const dist = cell.pos.distanceTo(unit.pos);
          if (dist < closestDist) {
            closestDist = dist;
            closestResourceTile = cell;
          }
        });
        if (closestResourceTile != null) {
          const dir = unit.pos.directionTo(closestResourceTile.pos);
          // move the unit in the direction towards the closest resource tile's position.
          actions.push(unit.move(dir));
        }
      } else {
        // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
        if (player.cities.size > 0) {
          const city: City = player.cities.values().next().value;
          let closestDist = 999999;
          let closestCityTile: CityTile = null;

          city.citytiles.forEach((citytile) => {
            const dist = citytile.pos.distanceTo(unit.pos);
            if (dist < closestDist) {
              closestCityTile = citytile;
              closestDist = dist;
            }
          });
          if (closestCityTile != null) {
            const dir = unit.pos.directionTo(closestCityTile.pos);
            actions.push(unit.move(dir));
          }
        }
      }
    }
  }

  player.cities.forEach((city) => {
    if (turn === 10) {
      const { x, y } = city.citytiles[0].pos;
      city.addCityTile(x + 1, y, 4);
    }
    // city.citytiles.forEach((tile) => {
    //   if (tile.canAct && turn === 50) {
    //     actions.push(tile.buildCart());
    //   }
    // });
  });

  // return the array of actions
  return actions;
});
