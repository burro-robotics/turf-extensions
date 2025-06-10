import * as turf from '@turf/turf';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {coordinatesEqual} from '../coordinates/cordinates-equal';

export function findCollisions(
  lineStrings: Feature<LineString>[],
): FeatureCollection<Point>[] {
  const collisionPoints: FeatureCollection<Point>[] = [];

  for (let i = 0; i < lineStrings.length; i++) {
    for (let j = i + 1; j < lineStrings.length; j++) {
      const firstLineString = lineStrings[i];
      const secondLineString = lineStrings[j];

      if (!turf.booleanIntersects(firstLineString, secondLineString)) {
        continue;
      }

      const intersectionPoints: FeatureCollection<Point> = turf.lineIntersect(
        firstLineString,
        secondLineString,
      );

      if (!intersectionPoints.features.length) {
        continue;
      }

      if (turf.booleanCrosses(firstLineString, secondLineString)) {
        collisionPoints.push(intersectionPoints);
        continue;
      }

      const firstLineCoords = turf.getCoords(firstLineString);
      const secondLineCoords = turf.getCoords(secondLineString);

      const firstLineStart = firstLineCoords[0];
      const firstLineEnd = firstLineCoords[firstLineCoords.length - 1];
      const secondLineStart = secondLineCoords[0];
      const secondLineEnd = secondLineCoords[secondLineCoords.length - 1];

      const isSharedEndpoint = intersectionPoints.features.some(
        intersection => {
          const coord = turf.getCoords(intersection);

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
