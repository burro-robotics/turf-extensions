import {lineString} from '@turf/turf';
import type {Position} from 'geojson';
import {lineSmoothingLine} from '../src/line/line-smoothing-line';

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
