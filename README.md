# Turf Extensions

Assorted functions extending the functionality of Turf.js.

## Installation

To install, run:

```sh
npm install turf-extensions
```

## API

The API is unstable, but includes the following:

```js
lineBezierSmoothing
lineSmoothingLine
linesSplittingLineAtCoordinate

bufferedConvex
cleanFeatureCollection
findCoordinate
findLineString

isLineStringFeature
isPointFeature
isPolygonFeature

coordinatesCalculatedAngularChanges
coordinatesCalculatedRadii
coordinatesEqual
coordinatesInsertingPointAfterNearestPointOnLine
coordinatesSubdividing
coordinatesToString
filterCoordinatesWithMaximumAngularChange
```

## Development

To build the project, run:

```sh
npm run build
```

## Testing

To run the tests, use:

```sh
npm test
```

For debugging tests, you can use the provided VS Code launch configuration "Debug Jest Tests".

## License

This project is licensed under the MIT License. See the LICENSE file for details.
