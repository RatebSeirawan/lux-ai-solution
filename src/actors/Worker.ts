import { head } from "ramda";

import { getClosestResources } from "../actions";
import { Cell, City, CityTile, Unit } from "../lux";
import Logger from "../logger";

export class Worker extends Unit {
  private _resourceTiles: Cell[];
  private _turn: number;
  private _cities: Map<string, City>;
  public hasSpace: boolean;

  public constructor(
    unit: Unit,
    resources: Cell[],
    cities: Map<string, City>,
    turn: number
  ) {
    new Logger(turn).unit(unit);

    super(
      unit.team,
      unit.type,
      unit.id,
      unit.pos.x,
      unit.pos.y,
      unit.cooldown,
      unit.cargo.wood,
      unit.cargo.coal,
      unit.cargo.uranium
    );
    this._resourceTiles = getClosestResources(resources, unit.pos);
    this._cities = cities;
    this._turn = turn;
    this.hasSpace = unit.getCargoSpaceLeft() > 0;
  }

  public goToClosestResourceTile(): string | null {
    if (!this._resourceTiles.length) return null;

    const dir = this.pos.directionTo(head(this._resourceTiles).pos);
    return this.move(dir);
  }

  public goToClosestCity(): string | null {
    if (!this._cities.size) return null;

    const city: City = this._cities.values().next().value;
    let closestDist = 999999;
    let closestCityTile: CityTile = null;

    city.citytiles.forEach((citytile) => {
      const dist = citytile.pos.distanceTo(this.pos);
      if (dist < closestDist) {
        closestCityTile = citytile;
        closestDist = dist;
      }
    });
    if (closestCityTile != null) {
      const dir = this.pos.directionTo(closestCityTile.pos);
      return this.move(dir);
    }
  }
}
