import {isLineStringFeature} from '@/feature/is-line-string-feature';
import {cleanCoords, clone} from '@turf/turf';
import type {FeatureCollection} from 'geojson';

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

  featureCollection.features = featureCollection.features?.filter(feature => {
    if (isLineStringFeature(feature)) {
      return feature.geometry.coordinates.length > 1;
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
