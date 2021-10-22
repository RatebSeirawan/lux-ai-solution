import {
  getClosestCityTiles,
  getClosestResources,
  getLowestFuelTiles,
} from "../actions";
import {
  Cell,
  City,
  CityTile,
  GameMap,
  Position,
  ResourceType,
  Unit,
} from "../lux";
import { logger } from "../logger";

export class Worker extends Unit {
  private resourceTiles: Cell[];
  private closestCityTiles: CityTile[];
  private turn: number;
  private cities: Map<string, City>;
  private gameMap: GameMap;
  public hasSpace: boolean;

  public constructor(
    unit: Unit,
    resources: Cell[],
    cities: Map<string, City>,
    gameMap: GameMap,
    type: ResourceType = "wood",
    turn: number
  ) {
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
    this.resourceTiles = getClosestResources(resources, unit.pos, type);
    this.closestCityTiles = getClosestCityTiles(cities, this.pos);
    this.gameMap = gameMap;
    this.cities = cities;
    this.turn = turn;
    this.hasSpace = unit.getCargoSpaceLeft() > 0;
  }

  public goToClosestResourceTile(): string | null {
    if (!this.resourceTiles.length) return null;

    const closest = this.resourceTiles[0];

    return this.moveTo(closest.pos);
  }

  public goToClosestCity(): string | null {
    const cities = getLowestFuelTiles(this.cities);

    if (!cities || !cities.length) return null;

    const city = cities[0];

    return this.moveTo(city.citytiles[0].pos);
  }

  public goToLowestResourceCity(): string | null {
    if (!this.closestCityTiles.length) return null;

    const tile = this.closestCityTiles[0];

    if (tile !== null) {
      return this.moveTo(tile.pos);
    }
  }

  public goToBuildingTile(): string {
    const dest = this.findClosestBuildingTile();

    if (!dest) return null;

    if (this.pos.equals(dest)) {
      return this.buildCity();
    }

    return this.moveTo(dest);
  }

  public findClosestBuildingTile(): Position | null {
    if (!this.closestCityTiles.length) return null;
    const closestCity = this.closestCityTiles[0];

    const cityTile = new Position(closestCity.pos.x, closestCity.pos.y);

    const candidates = cityTile
      .translateAll(this.gameMap.width)
      .filter((c) => this.gameMap.isEmpty(c));

    let closestDist = 999999;
    let closestCandidate: Position = null;

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const dist = this.pos.distanceTo(candidate);
      if (dist < closestDist) {
        closestDist = dist;
        closestCandidate = candidate;
      }
    }

    return closestCandidate;
  }

  public moveTo(pos: Position): string | null {
    const dir = this.pos.directionTo(pos);
    const path = this.pos.translate(dir);

    if (this.gameMap.isTaken(path)) return null;
    if (!this.gameMap.getCellByPos(path).citytile) {
      this.gameMap.setTaken(path);
    }
    return this.move(dir);
  }

  public hasBuildResouces() {
    // return this.cargo.wood + this.cargo.coal + this.cargo.uranium >= 100;
    return this.cargo.wood >= 100;
  }
}
