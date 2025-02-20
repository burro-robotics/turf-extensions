import type {Units} from '@turf/turf';
import {buffer, convex} from '@turf/turf';
import type {FeatureCollection, Polygon} from 'geojson';

export const bufferedConvex = ({
  featureCollection,
  bufferRadiusInMeters,
}: {
  featureCollection: FeatureCollection;
  bufferRadiusInMeters: number;
}): Polygon | undefined => {
  const convexed = convex(featureCollection);

  if (!convexed) {
    return undefined;
  }

  const buffered = buffer(convexed, bufferRadiusInMeters, {
    units: 'meters',
  } as {units: Units});

  return buffered?.geometry as Polygon;
};
