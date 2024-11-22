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
