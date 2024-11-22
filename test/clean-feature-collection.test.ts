import {cleanFeatureCollection} from '@/feature-collection/clean-feature-collection';
import {FeatureCollection} from 'geojson';

describe('removeAdjacentIdenticalPoints', () => {
  it('should remove adjacent identical points', () => {
    const destinationMap = {
      type: 'FeatureCollection',
      features: [
        {
          id: '1',
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 1],
              [1, 1],
              [1, 2],
              [1, 1],
            ],
          },
          properties: {
            direction: 'one_way',
            speed_limit: 0,
          },
        },
      ],
    };

    expect(destinationMap.features![0].geometry.coordinates).toHaveLength(7);

    cleanFeatureCollection({
      featureCollection: destinationMap as FeatureCollection,
      options: {mutate: true},
    });

    expect(destinationMap.features![0].geometry.coordinates).toHaveLength(4);
  });

  it('should remove LineString with fewer than 2 points', () => {
    const destinationMap: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          id: '1',
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
          properties: {
            direction: 'one_way',
            speed_limit: 0,
          },
        },
        {
          id: '2',
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [[0, 0]],
          },
          properties: {
            direction: 'one_way',
            speed_limit: 0,
          },
        },
        {
          id: '3',
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
          properties: {
            type: 'destination',
            name: 'askdjhkj',
          },
        },
      ],
    };

    expect(destinationMap.features).toHaveLength(3);

    cleanFeatureCollection({
      featureCollection: destinationMap as FeatureCollection,
      options: {mutate: true},
    });

    expect(destinationMap.features).toHaveLength(2);
  });
});
