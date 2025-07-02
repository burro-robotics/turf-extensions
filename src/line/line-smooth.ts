import {lineString} from '@turf/turf';
import {Feature, LineString} from 'geojson';

export function lineSmooth(
  lineString: Feature<LineString>,
  {
    factor = 0.75,
    iteration = 1,
    dimension,
  }: {
    factor?: number;
    iteration?: number;
    dimension?: number;
  },
) {
  while (iteration > 0) {
    lineString = lineSmoothSingle({lineString, factor, dimension});
    iteration--;
  }
  return lineString;
}

function lineSmoothSingle({
  lineString: aLineString,
  factor = 0.75,
  dimension,
}: {
  lineString: Feature<LineString>;
  factor?: number;
  dimension?: number;
}): Feature<LineString> {
  const inputCoordinates = aLineString.geometry.coordinates;
  const outputCoordinates = [];
  if (inputCoordinates.length > 0)
    outputCoordinates.push(Array.from(inputCoordinates[0]));
  for (const i in inputCoordinates) {
    const current = dimension
      ? inputCoordinates[i].slice(0, dimension)
      : inputCoordinates[i];
    const next = inputCoordinates[Number(i) + 1];
    if (!next) break;
    const Q = current.map(
      (axis, index) => factor * axis + (1 - factor) * next[index],
    );
    const R = current.map(
      (axis, index) => (1 - factor) * axis + factor * next[index],
    );
    outputCoordinates.push(Q);
    outputCoordinates.push(R);
  }
  if (inputCoordinates.length > 1)
    outputCoordinates.push(
      Array.from(inputCoordinates[inputCoordinates.length - 1]),
    );
  return lineString(outputCoordinates, aLineString.properties, {
    id: aLineString.id,
  });
}
