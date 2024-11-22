import type {Units} from '@turf/turf';
import {distance, point} from '@turf/turf';
import type {Feature, FeatureCollection, LineString, Position} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export const findLineString = (params: {
  inFeatureCollection: FeatureCollection;
  closestToCoordinates: Position;
  withinMeters: number;
}): {
  lineString: Feature<LineString> | null;
  coordinates: Position | null;
} => {
  const {closestToCoordinates, inFeatureCollection, withinMeters} = params;

  const lineStringFeatures = (inFeatureCollection.features?.filter(
    isLineStringFeature,
  ) ?? []) as Feature<LineString>[];

  const thePoint = point([closestToCoordinates[0], closestToCoordinates[1]]);

  let lineString: Feature<LineString> | null = null;
  let coordinates: Position | null = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (const lineStringFeature of lineStringFeatures) {
    for (const coordinate of lineStringFeature.geometry.coordinates) {
      const aPoint = point(coordinate);
      const distanceToPoint = distance(thePoint, aPoint, {
        units: 'meters',
      } as {units: Units});

      if (
        distanceToPoint <= withinMeters &&
        distanceToPoint < closestDistance
      ) {
        lineString = lineStringFeature;
        coordinates = coordinate;
        closestDistance = distanceToPoint;
      }
    }
  }

  return {lineString, coordinates};
};
