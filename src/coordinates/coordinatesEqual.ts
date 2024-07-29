import { booleanEqual, point } from "@turf/turf";
import type { Position } from "geojson";

export function coordinatesEqual(coord1: Position, coord2: Position) {
  return booleanEqual(point(coord1), point(coord2));
}
