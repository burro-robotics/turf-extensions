import {getCoords, lineString} from '@turf/turf';
import {Feature, FeatureCollection, Point} from 'geojson';
import {isLineStringFeature} from '../feature/is-line-string-feature';
import {lineIntersectFilteringEndpoints} from '../line/line-intersect-filtering-endpoints';

export function firstLineIntersectFilteringEndpoints({
  inFeatureCollection,
}: {
  inFeatureCollection: FeatureCollection;
}): Feature<Point> | undefined {
  for (const feature of inFeatureCollection.features) {
    if (!isLineStringFeature(feature)) {
      continue;
    }

    const coords = getCoords(feature);

    for (let index1 = 0; index1 < coords.length - 1; index1++) {
      const line1 = lineString([coords[index1], coords[index1 + 1]]);

      for (let index2 = index1 + 2; index2 < coords.length - 1; index2++) {
        const line2 = lineString([coords[index2], coords[index2 + 1]]);
        const intersections = lineIntersectFilteringEndpoints(line1, line2);

        if (intersections?.features.length ?? 0 > 0) {
          return intersections?.features[0];
        }
      }
    }
  }

  return undefined;
}
