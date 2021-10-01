import { Unit } from "../lux";

export const getAvailableWorks = (units: Unit[]) => {
  return units.filter((u) => u.isWorker() && u.canAct());
};
