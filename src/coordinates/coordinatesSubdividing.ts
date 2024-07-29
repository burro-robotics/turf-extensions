import { Units, along, length, lineString } from "@turf/turf";
import type { Position } from "geojson";

export function coordinatesSubdividing(params: {
  coordinates: Position[];
  byMaximumDistance: number;
  withOptions: {
    units?: Units;
  };
}): Position[] {
  const { coordinates, byMaximumDistance, withOptions } = params;
  if (coordinates.length < 2) {
    return coordinates;
  }
  const line = lineString(coordinates);
  const lineLength = length(line, withOptions);
  const divisionsCount = Math.ceil(lineLength / byMaximumDistance);

  const subdividedPath: Position[] = [];
  for (let i = 0; i <= divisionsCount; i++) {
    let segmentLength = (i / divisionsCount) * lineLength;
    let newPoint = along(line, segmentLength, withOptions);
    subdividedPath.push(newPoint.geometry.coordinates);
  }

  return subdividedPath;
}
