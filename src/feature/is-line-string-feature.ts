import type {Feature, LineString} from 'geojson';

export function isLineStringFeature(
  feature: Feature,
): feature is Feature<LineString> {
  return feature.geometry.type === 'LineString';
}
