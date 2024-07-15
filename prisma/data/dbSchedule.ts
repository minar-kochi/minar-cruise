import { schedulePartialId } from "../data";

export const schedule: schedulePartialId = [
  {
    day: new Date(Date.now()),
    schedulePackage: "BREAKFAST",
    scheduleStatus: "AVAILABLE",
    packageId: "clj9r7rku0000356cql29f672",
  },
  {
    day: new Date(Date.now() + 48 * 60 * 60 * 1000),
    schedulePackage: "DINNER",
    scheduleStatus: "AVAILABLE",
    packageId: "clqqxa3wq000208l5enk651jd",
  },
  {
    day: new Date(Date.now() + 24 * 60 * 60 * 1000),
    schedulePackage: "LUNCH",
    scheduleStatus: "AVAILABLE",
    packageId: "clqqx9xhp000108l5frrkhu8h",
  },
  {
    day: new Date(Date.now() + 64 * 60 * 60 * 1000),
    schedulePackage: "BREAKFAST",
    scheduleStatus: "AVAILABLE",
    packageId: "clj9r7rku0000356cql29f672",
  },
  {
    day: new Date(Date.now() + 74 * 60 * 60 * 1000),
    schedulePackage: "DINNER",
    scheduleStatus: "EXCLUSIVE",
    packageId: "clqqxbb7r000708l58m9f3ry2",
  },
];
