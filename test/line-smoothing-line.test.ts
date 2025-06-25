import {featureCollection, lineString} from '@turf/turf';
import type {Position} from 'geojson';
import {lineSmoothingLine} from '../src/line/line-smoothing-line';

describe('getNewLineSmoothingLine', () => {
  it('should return something', () => {
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

  it('should handle tricky cases', () => {
    const destinationMap = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'a1e3ce6d-4cd1-4dce-91a8-e3b4bb115a87',
          geometry: {
            type: 'LineString',
            coordinates: [
              [-75.553372123, 40.105225386],
              [-75.55337376, 40.105221809],
              [-75.553371874, 40.105215206],
              [-75.55336785, 40.105211777],
              [-75.553360599, 40.1052112],
              [-75.553352516, 40.105218121],
            ],
          },
          properties: {
            direction: 'two_way',
            speed_limit: 0,
            enabled: true,
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

    console.log(JSON.stringify(featureCollection([smoothedLineString])));

    expect(smoothedLineString).toBeDefined();
  });
});
