import { toMercator, toWgs84 } from "@turf/turf";
import { Bezier } from "bezier-js";
import type { Position } from "geojson";

export function lineBezierSmoothing(params: {
  coordinates: Position[];
  stepCount?: number | undefined;
}): Position[] {
  const { coordinates, stepCount } = params;

  const projectedPoints = coordinates.map((coordinate) => {
    const projected = toMercator(coordinate);
    return { x: projected[0], y: projected[1] };
  });
  const bezier = new Bezier(projectedPoints);
  const lookUpTable = bezier.getLUT(stepCount);

  const smoothedCoordinates = lookUpTable.map((point) => {
    return toWgs84([point.x, point.y]);
  });

  return smoothedCoordinates;
}
