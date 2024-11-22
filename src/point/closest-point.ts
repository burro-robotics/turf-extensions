import type {Units} from '@turf/turf';
import {distance, point} from '@turf/turf';
import type {FeatureCollection, Position} from 'geojson';
import {isPointFeature} from '../feature/is-point-feature';

export const closestPoint = (params: {
  inFeatureCollection: FeatureCollection;
  closestToCoordinate: Position;
  withinDistance?: number;
  units?: Units;
}): Position | null => {
  const {closestToCoordinate, inFeatureCollection, withinDistance, units} =
    params;

  const thePoint = point([closestToCoordinate[0], closestToCoordinate[1]]);

  let closestCoordinate: Position | null = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (const feature of inFeatureCollection.features) {
    if (isPointFeature(feature)) {
      const aPoint = point(feature.geometry.coordinates);
      const distanceToPoint = distance(thePoint, aPoint, {units});
      const isCloser = distanceToPoint < closestDistance;

      if (isCloser) {
        if (withinDistance === undefined) {
          closestCoordinate = feature.geometry.coordinates;
          closestDistance = distanceToPoint;
        } else if (distanceToPoint <= withinDistance) {
          closestCoordinate = feature.geometry.coordinates;
          closestDistance = distanceToPoint;
        }
      }
    }
  }

  return closestCoordinate;
};
