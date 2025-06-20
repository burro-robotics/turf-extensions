import {distance, Units} from '@turf/turf';
import type {Position} from 'geojson';
import {coordinatesCalculatedRadii} from '../coordinates/coordinate-calculated-radii';
import {coordinatesSubdividing} from '../coordinates/coordinates-subdividing';
import {lineBezierSmoothing} from '../line/line-bezier-smoothing';
import {linesSplittingLineAtCoordinate} from './line-splitting-line-at-coordinate';

export function lineSmoothingLine(params: {
  coordinates: Position[];
  stanceDistance: number;
  minimumRadius: number;
  withOptions: {
    units?: Units;
  };
}): Position[] {
  const {coordinates, stanceDistance, withOptions, minimumRadius} = params;

  const subdividedCoordinates = coordinatesSubdividing({
    coordinates,
    byMaximumDistance: stanceDistance,
    withOptions: withOptions,
  });

  const radiiOfSubdividedPath = coordinatesCalculatedRadii({
    coordinates: subdividedCoordinates,
    withOptions: withOptions,
  });

  const indexOfFirstInsufficientRadius = radiiOfSubdividedPath.findIndex(
    r => r < minimumRadius,
  );

  if (indexOfFirstInsufficientRadius === -1) {
    return coordinates;
  }

  const insufficientRadiusCoordinate =
    subdividedCoordinates[indexOfFirstInsufficientRadius];

  let indexBehind = indexOfFirstInsufficientRadius - 1;
  let foundIndexBehind = false;

  while (indexBehind >= 0) {
    const isDistantEnough =
      distance(
        subdividedCoordinates[indexBehind],
        insufficientRadiusCoordinate,
        withOptions,
      ) >
      minimumRadius / 2.0;

    if (isDistantEnough) {
      foundIndexBehind = true;
      break;
    }

    indexBehind--;
  }

  if (!foundIndexBehind) {
    return [];
  }

  const coordinateBehind = subdividedCoordinates[indexBehind];
  const coordinatesBehind = linesSplittingLineAtCoordinate({
    coordinates,
    coordinate: coordinateBehind,
  })![0];

  let indexAhead = indexOfFirstInsufficientRadius + 1;
  let foundIndexAhead = false;

  while (indexAhead < subdividedCoordinates.length) {
    const isDistantEnough =
      distance(
        subdividedCoordinates[indexAhead],
        insufficientRadiusCoordinate,
        withOptions,
      ) >
      minimumRadius / 2.0;

    if (isDistantEnough) {
      foundIndexAhead = true;
      break;
    }

    indexAhead++;
  }

  if (!foundIndexAhead) {
    return [];
  }

  const coordinateAhead = subdividedCoordinates[indexAhead];
  const coordinatesAhead = linesSplittingLineAtCoordinate({
    coordinates,
    coordinate: coordinateAhead,
  })![1];

  const stepCount = indexAhead - indexBehind;

  const bezierSmoothedLine = lineBezierSmoothing({
    coordinates: [
      coordinateBehind,
      insufficientRadiusCoordinate,
      coordinateAhead,
    ],
    stepCount,
  });

  const smoothedLine = [
    ...coordinatesBehind,
    ...bezierSmoothedLine.slice(1, bezierSmoothedLine.length - 1),
    ...lineSmoothingLine({
      coordinates: coordinatesAhead,
      stanceDistance,
      minimumRadius,
      withOptions,
    }),
  ];

  return smoothedLine;
}

/**
 * This function calculates the optimal minimum radius for line smoothing based on
 * coordinates received. The idea is to calculate the distance between each line of the
 * coordinate in order to get the optimial minimun radius for safe line smoothing.
 * @param coordinates
 * @returns the minumin radius to be considered when line smoothing
 */
export function getOptimalMinimumRadius(coordinates: Position[]): number {
  if (coordinates.length < 2) {
    return 0.1;
  }

  const segmentLengths: number[] = [];
  for (const [i, coord] of coordinates.entries()) {
    if (i === coordinates.length - 1) continue;
    const segmentLength = distance(coord, coordinates[i + 1], {
      units: 'meters',
    });
    segmentLengths.push(segmentLength);
  }

  // This 0.5 value should be considered as the safest value.
  // Lower values tend to not smooth anything.
  // Higher values tend to break the smooth operation.
  // Might be necessary to have some sort of slider or input so user can change this.
  return Math.min(...segmentLengths) * 0.5;
}
