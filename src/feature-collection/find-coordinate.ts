import type {Units} from '@turf/turf';
import {distance, point} from '@turf/turf';
import type {FeatureCollection, Position} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export const findCoordinate = (params: {
  inFeatureCollection: FeatureCollection;
  closestToCoordinate: Position;
  withinDistance: number;
  units?: Units;
}): Position | null => {
  const {closestToCoordinate, inFeatureCollection, withinDistance, units} =
    params;

  const thePoint = point([closestToCoordinate[0], closestToCoordinate[1]]);

  let closestCoordinate: Position | null = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (const feature of inFeatureCollection.features) {
    if (isLineStringFeature(feature)) {
      for (const coordinate of feature.geometry.coordinates) {
        const aPoint = point(coordinate);
        const distanceToPoint = distance(thePoint, aPoint, {units});

        if (
          distanceToPoint <= withinDistance &&
          distanceToPoint < closestDistance
        ) {
          closestCoordinate = coordinate;
          closestDistance = distanceToPoint;
        }
      }
    }
  }

  return closestCoordinate;
};
