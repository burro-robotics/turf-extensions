import {featureCollection, lineString} from '@turf/turf';
import {Feature, FeatureCollection, LineString, Position} from 'geojson';
import {coordinatesReversing} from '../coordinates/coordinates-reversing';
import {coordinatesToString} from '../coordinates/coordinates-to-string';
import {isLineStringFeature} from '../feature/is-line-string-feature';

export function mergeExtendedLineStrings({
  inFeatureCollection,
}: {
  inFeatureCollection: FeatureCollection;
}): FeatureCollection {
  const endpointMap = new Map<string, Feature<LineString>[]>();

  // Step 1: Index endpoints
  for (const feature of inFeatureCollection.features) {
    if (!isLineStringFeature(feature)) continue;
    const coords = feature.geometry.coordinates;
    const startKey = coordinatesToString(coords[0]);
    const endKey = coordinatesToString(coords[coords.length - 1]);

    for (const key of [startKey, endKey]) {
      if (!endpointMap.has(key)) {
        endpointMap.set(key, []);
      }
      endpointMap.get(key)!.push(feature);
    }
  }

  const visited = new Set<Feature<LineString>>();
  const mergedLines: Feature<LineString>[] = [];

  // Step 2: Walk and merge combinable chains
  for (const feature of inFeatureCollection.features) {
    if (!isLineStringFeature(feature) || visited.has(feature)) continue;

    let coords = [...feature.geometry.coordinates];
    visited.add(feature);

    const mergedProperties = {...feature.properties};

    let extended = true;
    while (extended) {
      extended = false;

      const startKey = coordinatesToString(coords[0]);
      const endKey = coordinatesToString(coords[coords.length - 1]);

      for (const [key, isStart] of [
        [startKey, true],
        [endKey, false],
      ] as const) {
        const connected = endpointMap.get(key);
        if (!connected || connected.length !== 2) continue;

        const other = connected.find(f => !visited.has(f));
        if (!other) continue;

        const otherCoords = other.geometry.coordinates;
        const otherStartKey = coordinatesToString(otherCoords[0]);
        const otherEndKey = coordinatesToString(
          otherCoords[otherCoords.length - 1],
        );

        let newCoords: Position[];
        if (key === otherStartKey) {
          newCoords = coordinatesReversing(otherCoords);
        } else if (key === otherEndKey) {
          newCoords = otherCoords;
        } else {
          continue;
        }

        if (isStart) {
          coords = [...newCoords.slice(0, -1), ...coords];
        } else {
          coords = [...coords, ...newCoords.slice(1)];
        }

        visited.add(other);
        extended = true;
        break;
      }
    }

    mergedLines.push(lineString(coords, mergedProperties));
  }

  // Step 3: Reconstruct final FeatureCollection
  const outputFeatures: Feature[] = [];

  for (const feature of inFeatureCollection.features) {
    if (!isLineStringFeature(feature)) {
      // Keep non-LineString features
      outputFeatures.push(feature);
    } else if (!visited.has(feature)) {
      // Keep untouched LineStrings
      outputFeatures.push(feature);
    }
  }

  outputFeatures.push(...mergedLines);

  return featureCollection(outputFeatures);
}
