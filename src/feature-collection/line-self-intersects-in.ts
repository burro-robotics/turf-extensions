import {
  featureCollection,
  getCoords,
  lineIntersect,
  lineString,
} from '@turf/turf';
import {FeatureCollection, Point} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export function lineSelfIntersectsIn(
  inFeatureCollection: FeatureCollection,
): FeatureCollection<Point> | undefined {
  const result: FeatureCollection<Point> = featureCollection([]);

  for (const feature of inFeatureCollection.features) {
    if (!isLineStringFeature(feature)) {
      continue;
    }

    const coords = getCoords(feature);

    for (let index1 = 0; index1 < coords.length - 1; index1++) {
      const line1 = lineString([coords[index1], coords[index1 + 1]]);

      for (let index2 = index1 + 2; index2 < coords.length - 1; index2++) {
        if (index1 === index2 - 1) continue;

        const line2 = lineString([coords[index2], coords[index2 + 1]]);
        const intersections = lineIntersect(line1, line2);

        result.features.push(...intersections.features);
      }
    }
  }

  if (result.features.length === 0) {
    return undefined;
  }

  return result;
}
