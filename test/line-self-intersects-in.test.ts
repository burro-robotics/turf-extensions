import {featureCollection, lineString} from '@turf/turf';
import {lineSelfIntersectsIn} from '../src/feature-collection/line-self-intersects-in';

describe('lineSelfIntersectsIn', () => {
  test('should detect self-intersections', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        lineString([
          [0, 0],
          [1, 0],
          [1, -1],
          [0.5, 0.25],
        ]),
        lineString([
          [0.5, 0.5],
          [1, 0.5],
        ]),
      ]),
    );

    expect(result?.features).toHaveLength(1);
  });

  it('should not detect interior crossings as collisions', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        lineString(
          [
            [0, 0],
            [2, 2],
          ],
          {id: 'line1'},
        ),
        lineString(
          [
            [0, 2],
            [2, 0],
          ],
          {id: 'line2'},
        ),
      ]),
    );

    expect(result?.features).toBeUndefined();
  });

  test('should return undefined for empty FeatureCollection', () => {
    const result = lineSelfIntersectsIn(featureCollection([]));
    expect(result).toBeUndefined();
  });

  test('should return undefined for FeatureCollection with no LineString features', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [0, 0]},
          properties: {},
        },
      ]),
    );
    expect(result).toBeUndefined();
  });

  test('should detect intersection in a self-intersecting LineString (bowtie)', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        lineString([
          [0, 0],
          [2, 2],
          [0, 2],
          [2, 0],
        ]),
      ]),
    );
    expect(result?.features.length).toBeGreaterThan(0);
  });

  test('should not detect intersection for a simple LineString', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        lineString([
          [0, 0],
          [1, 1],
          [2, 2],
        ]),
      ]),
    );
    expect(result).toBeUndefined();
  });

  test('should detect multiple intersections in a complex LineString', () => {
    const result = lineSelfIntersectsIn(
      featureCollection([
        lineString([
          [0, 0],
          [2, 2],
          [2, 0],
          [0, 2],
          [0, 0],
        ]),
      ]),
    );
    expect(result?.features.length).toBeGreaterThan(1);
  });
});
