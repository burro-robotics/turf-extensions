import {featureCollection} from '@turf/turf';
import {FeatureCollection, Point} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';
import {lineIntersectFilteringEndpoints} from '../line/line-intersect-filtering-endpoints';

export function lineIntersectsFilteringEndpointsIn(
  inFeatureCollection: FeatureCollection,
  options?: {
    removeDuplicates?: boolean;
    ignoreSelfIntersections?: boolean;
  },
): FeatureCollection<Point> | undefined {
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

      result.features.push(
        ...(lineIntersectFilteringEndpoints(feature1, feature2, options)
          ?.features ?? []),
      );
    }
  }

  if (result.features.length === 0) {
    return undefined;
  }

  return result;
}
