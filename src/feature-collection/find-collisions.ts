import {
  booleanIntersects,
  lineIntersect,
  booleanCrosses,
  getCoords,
} from '@turf/turf';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {coordinatesEqual} from '../coordinates/cordinates-equal';

export function findCollisions(
  lineStrings: Feature<LineString>[],
): FeatureCollection<Point>[] {
  const collisionPoints: FeatureCollection<Point>[] = [];

  for (const [i, firstLineString] of lineStrings.entries()) {
    for (const [j, secondLineString] of lineStrings.entries()) {
      if (j <= i) continue;

      if (!booleanIntersects(firstLineString, secondLineString)) {
        continue;
      }

      const intersectionPoints: FeatureCollection<Point> = lineIntersect(
        firstLineString,
        secondLineString,
      );

      if (!intersectionPoints.features.length) {
        continue;
      }

      if (booleanCrosses(firstLineString, secondLineString)) {
        collisionPoints.push(intersectionPoints);
        continue;
      }

      const firstLineCoords = getCoords(firstLineString);
      const secondLineCoords = getCoords(secondLineString);

      const firstLineStart = firstLineCoords[0];
      const firstLineEnd = firstLineCoords[firstLineCoords.length - 1];
      const secondLineStart = secondLineCoords[0];
      const secondLineEnd = secondLineCoords[secondLineCoords.length - 1];

      const isSharedEndpoint = intersectionPoints.features.some(
        intersection => {
          const coord = getCoords(intersection);

          const touchesLine1Endpoint =
            coordinatesEqual(coord, firstLineStart) ||
            coordinatesEqual(coord, firstLineEnd);
          const touchesLine2Endpoint =
            coordinatesEqual(coord, secondLineStart) ||
            coordinatesEqual(coord, secondLineEnd);

          return touchesLine1Endpoint && touchesLine2Endpoint;
        },
      );

      if (!isSharedEndpoint) {
        collisionPoints.push(intersectionPoints);
      }
    }
  }
  return collisionPoints;
}
