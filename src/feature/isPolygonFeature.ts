import type { Feature, Polygon } from "geojson";

export function isPolygonFeature(
  feature: Feature
): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}
