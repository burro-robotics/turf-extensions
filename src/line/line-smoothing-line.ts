import {cleanCoords, distance, lineString, Units} from '@turf/turf';
import type {Feature, LineString, Position} from 'geojson';
import {coordinatesCalculatedRadii} from '../coordinates/coordinate-calculated-radii';
import {coordinatesSubdividing} from '../coordinates/coordinates-subdividing';
import {lineBezierSmoothing} from '../line/line-bezier-smoothing';
import {linesSplittingLineAtCoordinate} from './line-splitting-line-at-coordinate';

export function lineSmoothingLine({
  coordinates,
  stanceDistance,
  withOptions,
  minimumRadius,
}: {
  coordinates: Position[];
  stanceDistance: number;
  minimumRadius: number;
  withOptions: {
    units?: Units;
  };
}): Position[] {
  if (coordinates.length <= 2) {
    return coordinates;
  }

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
    indexBehind = indexOfFirstInsufficientRadius - 1;
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
    if (indexOfFirstInsufficientRadius + 1 < subdividedCoordinates.length) {
      indexAhead = indexOfFirstInsufficientRadius + 1;
    } else {
      return [];
    }
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

  const smoothenedPositions: Position[] = bezierSmoothedLine.slice(
    1,
    bezierSmoothedLine.length - 1,
  );
  const smoothedAhead = lineSmoothingLine({
    coordinates: coordinatesAhead,
    stanceDistance,
    minimumRadius,
    withOptions,
  });

  const smoothedLine = [
    ...coordinatesBehind,
    ...smoothenedPositions,
    ...smoothedAhead,
  ];

  const aLineString: Feature<LineString> = cleanCoords(
    lineString(smoothedLine),
  );

  return aLineString.geometry.coordinates;
}
