import {Feature, FeatureCollection, LineString} from 'geojson';
import {coordinatesToString} from '../coordinates/coordinates-to-string';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export function mergeExtendedLineStrings({
  inFeatureCollection,
  options = {
    allowMergingAtIntersections: true,
  },
}: {
  inFeatureCollection: FeatureCollection;
  options?: {
    allowMergingAtIntersections?: boolean;
  };
}): FeatureCollection {
  const {allowMergingAtIntersections = false} = options;

  // Count how many lines connect to each endpoint
  const endpointCount = new Map<string, number>();
  const endpointToFeatures = new Map<string, Feature<LineString>[]>();

  for (const feature of inFeatureCollection.features.filter(
    isLineStringFeature,
  )) {
    const coords = feature.geometry.coordinates;
    const start = coordinatesToString(coords[0]);
    const end = coordinatesToString(coords[coords.length - 1]);

    for (const point of [start, end]) {
      endpointCount.set(point, (endpointCount.get(point) || 0) + 1);
      if (!endpointToFeatures.has(point)) {
        endpointToFeatures.set(point, []);
      }
      endpointToFeatures.get(point)!.push(feature);
    }
  }

  const visited = new Set<Feature<LineString>>();
  const mergedLines: Feature<LineString>[] = [];

  for (const feature of inFeatureCollection.features.filter(
    isLineStringFeature,
  )) {
    if (visited.has(feature)) continue;

    let coords = [...feature.geometry.coordinates];
    visited.add(feature);

    let extended = true;

    // Extend forward
    while (extended) {
      const end = coordinatesToString(coords[coords.length - 1]);
      const connected = endpointToFeatures.get(end) || [];

      if (
        (allowMergingAtIntersections && connected.length >= 2) ||
        (!allowMergingAtIntersections && connected.length === 2)
      ) {
        const next = connected.find(f => !visited.has(f));
        if (next) {
          const nextCoords = next.geometry.coordinates;
          if (coordinatesToString(nextCoords[0]) === end) {
            coords = coords.concat(nextCoords.slice(1));
          } else {
            coords = coords.concat(nextCoords.slice(0, -1).reverse());
          }
          visited.add(next);
          continue;
        }
      }

      extended = false;
    }

    // Extend backward
    extended = true;
    while (extended) {
      const start = coordinatesToString(coords[0]);
      const connected = endpointToFeatures.get(start) || [];

      if (
        (allowMergingAtIntersections && connected.length >= 2) ||
        (!allowMergingAtIntersections && connected.length === 2)
      ) {
        const prev = connected.find(f => !visited.has(f));
        if (prev) {
          const prevCoords = prev.geometry.coordinates;
          if (
            coordinatesToString(prevCoords[prevCoords.length - 1]) === start
          ) {
            coords = prevCoords.slice(0, -1).concat(coords);
          } else {
            coords = prevCoords.slice(1).reverse().concat(coords);
          }
          visited.add(prev);
          continue;
        }
      }
      extended = false;
    }

    mergedLines.push({
      ...feature,
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features: [
      ...mergedLines,
      ...inFeatureCollection.features.filter(
        value => !isLineStringFeature(value),
      ),
    ],
  };
}
