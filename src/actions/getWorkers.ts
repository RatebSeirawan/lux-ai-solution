import { Unit } from "../lux";

export const getWorkers = (units: Unit[]) => {
  return units.filter((u) => u.isWorker());
};
