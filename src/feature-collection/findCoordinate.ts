import type { Units } from "@turf/turf";
import { distance, point } from "@turf/turf";
import type { Feature, FeatureCollection, LineString, Position } from "geojson";
import { isLineStringFeature } from "../feature/isLineStringFeature";

export const findCoordinate = (params: {
  inFeatureCollection: FeatureCollection;
  closestToCoordinate: Position;
  withinMeters: number;
}): Position | null => {
  const { closestToCoordinate, inFeatureCollection, withinMeters } = params;

  const lineStringFeatures = (inFeatureCollection.features?.filter(
    isLineStringFeature
  ) ?? []) as Feature<LineString>[];

  const thePoint = point([closestToCoordinate[0], closestToCoordinate[1]]);

  let closestCoordinate: Position | null = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (const lineStringFeature of lineStringFeatures) {
    for (const coordinate of lineStringFeature.geometry.coordinates) {
      const aPoint = point(coordinate);
      const distanceToPoint = distance(thePoint, aPoint, {
        units: "meters",
      } as { units: Units });

      if (
        distanceToPoint <= withinMeters &&
        distanceToPoint < closestDistance
      ) {
        closestCoordinate = coordinate;
        closestDistance = distanceToPoint;
      }
    }
  }

  return closestCoordinate;
};
