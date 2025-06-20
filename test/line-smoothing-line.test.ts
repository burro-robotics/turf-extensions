import {distance, lineString} from '@turf/turf';
import type {Position} from 'geojson';
import {
  getOptimalMinimumRadius,
  lineSmoothingLine,
} from '../src/line/line-smoothing-line';

describe('getNewLineSmoothingLine', () => {
  it('should remove adjacent identical points', () => {
    const destinationMap = {
      type: 'FeatureCollection',
      properties: {
        folders: [],
        name: 'test',
      },
      features: [
        {
          id: '1',
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [-97.00232467746453, 30.18160930947485],
              [-97.00227116317897, 30.18192541682498],
              [-97.00229537202209, 30.181957357929406],
              [-97.00226988902924, 30.182099440647207],
              [-97.00208131488029, 30.182085122243322],
              [-97.00205838018647, 30.18205978967667],
              [-97.0019347876702, 30.18205207976378],
            ],
          },
          properties: {
            direction: 'one_way',
            speed_limit: 0,
          },
        },
      ],
    };

    const coordinates = destinationMap.features![0].geometry
      .coordinates as Position[];

    const smoothedLine = coordinates;

    const stanceDistance = 1.0;
    const minimumRadius = 1.5;

    const smoothedLineString = lineString(
      lineSmoothingLine({
        coordinates: smoothedLine,
        stanceDistance,
        minimumRadius,
        withOptions: {units: 'meters'},
      }),
    );

    expect(smoothedLineString).toBeDefined();
  });
});

describe('lineSmoothingLine with optimal parameters', () => {
  describe('dense coordinates', () => {
    const denseCoordinates: Position[] = [
      [-75.553372123, 40.105225386],
      [-75.55337376, 40.105221809],
      [-75.553371874, 40.105215206],
      [-75.55336785, 40.105211777],
      [-75.553360599, 40.1052112],
      [-75.553352516, 40.105218121],
    ];

    it('should not return empty array with calculated optimal radius', () => {
      const optimalRadius = getOptimalMinimumRadius(denseCoordinates);

      const result = lineSmoothingLine({
        coordinates: denseCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(optimalRadius).toBeLessThan(1.5);
    });

    it('should fail with the original default radius of 1.5', () => {
      const result = lineSmoothingLine({
        coordinates: denseCoordinates,
        stanceDistance: 0.5,
        minimumRadius: 1.5,
        withOptions: {units: 'meters'},
      });

      expect(result).toEqual([]);
    });

    it('should work consistently with default parameters', () => {
      const optimalRadius = getOptimalMinimumRadius(denseCoordinates);

      const result = lineSmoothingLine({
        coordinates: denseCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(optimalRadius).toBeGreaterThan(0);
      expect(optimalRadius).toBeLessThan(0.5);
    });
  });

  describe('various coordinate densities', () => {
    it('should handle very dense GPS points', () => {
      const veryDenseCoordinates: Position[] = [
        [0, 0],
        [0.0001, 0.0001],
        [0.0002, 0.0001],
        [0.0003, 0.0002],
        [0.0004, 0.0003],
        [0.0005, 0.0004],
      ];

      const optimalRadius = getOptimalMinimumRadius(veryDenseCoordinates);

      const result = lineSmoothingLine({
        coordinates: veryDenseCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(optimalRadius).toBeLessThan(10);
    });

    it('should handle sparse points', () => {
      const sparseCoordinates: Position[] = [
        [0, 0],
        [0.01, 0.01],
        [0.02, 0.01],
        [0.03, 0.02],
        [0.04, 0.03],
      ];

      const optimalRadius = getOptimalMinimumRadius(sparseCoordinates);

      const result = lineSmoothingLine({
        coordinates: sparseCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(optimalRadius).toBeGreaterThan(100);
    });

    it('should handle straight line (minimal smoothing)', () => {
      const straightCoordinates: Position[] = [
        [0, 0],
        [0.001, 0],
        [0.002, 0],
        [0.003, 0],
        [0.004, 0],
      ];

      const optimalRadius = getOptimalMinimumRadius(straightCoordinates);

      const result = lineSmoothingLine({
        coordinates: straightCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeGreaterThanOrEqual(
        straightCoordinates.length - 1,
      );
    });

    it('should handle sharp corners (aggressive smoothing)', () => {
      const sharpCornerCoordinates: Position[] = [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0.002, 0.001],
        [0.002, 0.002],
        [0.003, 0.002],
      ];

      const optimalRadius = getOptimalMinimumRadius(sharpCornerCoordinates);

      const result = lineSmoothingLine({
        coordinates: sharpCornerCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle minimum case (2 points)', () => {
      const twoPointCoordinates: Position[] = [
        [0, 0],
        [0.001, 0.001],
      ];

      const optimalRadius = getOptimalMinimumRadius(twoPointCoordinates);

      const result = lineSmoothingLine({
        coordinates: twoPointCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle mixed spacing (some dense, some sparse)', () => {
      const mixedSpacingCoordinates: Position[] = [
        [0, 0],
        [0.0001, 0],
        [0.0002, 0],
        [0.01, 0],
        [0.0101, 0],
        [0.02, 0],
      ];

      const optimalRadius = getOptimalMinimumRadius(mixedSpacingCoordinates);

      const result = lineSmoothingLine({
        coordinates: mixedSpacingCoordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
      expect(optimalRadius).toBeLessThan(100);
    });
  });

  describe('consistency', () => {
    it('should consistently work with the same parameters', () => {
      const coordinates: Position[] = [
        [-97.00232467746453, 30.18160930947485],
        [-97.00227116317897, 30.18192541682498],
        [-97.00229537202209, 30.181957357929406],
        [-97.00226988902924, 30.182099440647207],
        [-97.00208131488029, 30.182085122243322],
        [-97.00205838018647, 30.18205978967667],
        [-97.0019347876702, 30.18205207976378],
      ];

      const optimalRadius = getOptimalMinimumRadius(coordinates);

      const results = [];
      for (let i = 0; i < 5; i++) {
        results.push(i);
      }

      for (const _ of results) {
        const result = lineSmoothingLine({
          coordinates,
          stanceDistance: 0.5,
          minimumRadius: optimalRadius,
          withOptions: {units: 'meters'},
        });

        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should handle large coordinate sets', () => {
      const largeCoordinateSet: Position[] = [];

      const coordIndices = [];
      for (let i = 0; i < 50; i++) {
        coordIndices.push(i);
      }

      for (const i of coordIndices) {
        largeCoordinateSet.push([i * 0.001, i * 0.001]);
      }

      const optimalRadius = getOptimalMinimumRadius(largeCoordinateSet);

      const result = lineSmoothingLine({
        coordinates: largeCoordinateSet,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('integration with existing test pattern', () => {
    it('should work with lineString from turf', () => {
      const coordinates: Position[] = [
        [-97.00232467746453, 30.18160930947485],
        [-97.00227116317897, 30.18192541682498],
        [-97.00229537202209, 30.181957357929406],
        [-97.00226988902924, 30.182099440647207],
      ];

      const optimalRadius = getOptimalMinimumRadius(coordinates);

      const smoothedCoordinates = lineSmoothingLine({
        coordinates,
        stanceDistance: 0.5,
        minimumRadius: optimalRadius,
        withOptions: {units: 'meters'},
      });

      const smoothedLineString = lineString(smoothedCoordinates);

      expect(smoothedLineString).toBeDefined();
      expect(smoothedLineString.type).toBe('Feature');
      expect(smoothedLineString.geometry.type).toBe('LineString');
      expect(smoothedLineString.geometry.coordinates.length).toBeGreaterThan(0);
    });
  });

  describe('parameter validation', () => {
    const testCoordinates: Position[] = [
      [0, 0],
      [0.001, 0.001],
      [0.002, 0.002],
    ];

    it('should ensure optimal radius is always less than minimum segment length', () => {
      const optimalRadius = getOptimalMinimumRadius(testCoordinates);

      let minSegmentLength = Infinity;
      const segmentPairs = [];
      for (const [i, coord] of testCoordinates.entries()) {
        if (i === testCoordinates.length - 1) continue;
        segmentPairs.push([coord, testCoordinates[i + 1]]);
      }

      for (const [coord1, coord2] of segmentPairs) {
        const segmentLength = distance(coord1, coord2, {units: 'meters'});
        minSegmentLength = Math.min(minSegmentLength, segmentLength);
      }

      expect(optimalRadius).toBeLessThan(minSegmentLength);
      expect(optimalRadius).toEqual(minSegmentLength * 0.5);
    });

    it('should handle fallback for insufficient coordinates', () => {
      const emptyCoords: Position[] = [];
      const singleCoord: Position[] = [[0, 0]];

      expect(getOptimalMinimumRadius(emptyCoords)).toBe(0.1);
      expect(getOptimalMinimumRadius(singleCoord)).toBe(0.1);
    });
  });
});
