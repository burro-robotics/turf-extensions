import {cleanCoords, clone} from '@turf/turf';
import type {FeatureCollection} from 'geojson';
import {coordinatesEveryEqual} from '../coordinates/coordinates-all-equal';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export function cleanFeatureCollection({
  featureCollection: inputFeatureCollection,
  options = {},
}: {
  featureCollection: FeatureCollection;
  options?: {
    mutate?: boolean;
  };
}): FeatureCollection {
  const {mutate = false} = options;
  const featureCollection = mutate
    ? inputFeatureCollection
    : clone(inputFeatureCollection);

  featureCollection.features = featureCollection.features?.filter(value => {
    if (isLineStringFeature(value)) {
      return (
        value.geometry.coordinates.length > 1 &&
        !coordinatesEveryEqual({coordinates: value.geometry.coordinates})
      );
    }

    return true;
  });

  featureCollection.features?.forEach(feature => {
    if (isLineStringFeature(feature)) {
      try {
        cleanCoords(feature, {mutate: true});
      } catch (error) {
        console.log(error);
      }
    }
  });

  return featureCollection;
}
