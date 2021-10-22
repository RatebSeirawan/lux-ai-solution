import { City } from "../lux";

export const getLowestFuelTiles = (cities: Map<string, City>): City[] => {
  if (!cities.size) return [];

  return Array.from(cities)
    .sort((a, b) => {
      const distA = a[1].fuel;
      const distB = b[1].fuel;

      return distA - distB;
    })
    .map((e) => e[1]);
};
