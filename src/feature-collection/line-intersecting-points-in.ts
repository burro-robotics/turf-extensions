import {featureCollection} from '@turf/turf';
import {FeatureCollection, Point} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';
import {lineIntersectingPoints} from '../line/line-intersecting-points';

export function lineIntersectingPointsIn(
  inFeatureCollection: FeatureCollection,
  options?: {
    includeSharedEndpoints: boolean;
  },
): FeatureCollection<Point> {
  const result: FeatureCollection<Point> = featureCollection([]);

  for (const [index1, feature1] of inFeatureCollection.features.entries()) {
    if (!isLineStringFeature(feature1)) {
      continue;
    }
    for (const [index2, feature2] of inFeatureCollection.features.entries()) {
      if (!isLineStringFeature(feature2)) {
        continue;
      }
      if (index2 <= index1) continue;

      const aLineIntersectionPoints = lineIntersectingPoints(
        feature1,
        feature2,
        options,
      );
      result.features.push(...(aLineIntersectionPoints?.features ?? []));
    }
  }

  return result;
}
