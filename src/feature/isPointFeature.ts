import type { Feature, Point } from "geojson";

export function isPointFeature(feature: Feature): feature is Feature<Point> {
  return feature.geometry.type === "Point";
}
