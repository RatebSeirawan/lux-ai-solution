import { City, CityTile, Position } from "../lux";

export const getClosestCityTiles = (
  cities: Map<string, City>,
  pos: Position
): CityTile[] => {
  if (!cities.size) return [];

  return Array.from(cities)
    .reduce((arr, [, val]) => {
      return [...arr, ...val.citytiles];
    }, [])
    .sort((a, b) => {
      const distA = a.pos.distanceTo(pos);
      const distB = b.pos.distanceTo(pos);

      return distA - distB;
    });
};
