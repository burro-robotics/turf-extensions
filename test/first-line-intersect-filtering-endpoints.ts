import {featureCollection, lineString} from '@turf/turf';
import {firstLineIntersectFilteringEndpoints} from '../src/feature-collection/boolean-has-line-intersect-filtering-endpoints';

describe('firstLineIntersectFilteringEndpoints', () => {
  it('should return the first interior intersection point in a self-intersecting LineString', () => {
    const fc = featureCollection([
      lineString(
        [
          [0, 0],
          [2, 2],
          [2, 0],
          [0, 2],
        ],
        {id: 'self_intersecting'},
      ),
    ]);

    const intersection = firstLineIntersectFilteringEndpoints({
      inFeatureCollection: fc,
    });

    expect(intersection).toBeDefined();
    expect(intersection?.geometry.type).toBe('Point');
    expect(intersection?.geometry.coordinates).toEqual([1, 1]);
  });

  it('should return undefined when there are no intersections', () => {
    const fc = featureCollection([
      lineString(
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        {id: 'straight_line'},
      ),
    ]);

    const intersection = firstLineIntersectFilteringEndpoints({
      inFeatureCollection: fc,
    });

    expect(intersection).toBeUndefined();
  });

  it('should ignore shared endpoints as intersections', () => {
    const fc = featureCollection([
      lineString(
        [
          [0, 0],
          [1, 1],
          [2, 0],
        ],
        {id: 'v_shape'},
      ),
    ]);

    const intersection = firstLineIntersectFilteringEndpoints({
      inFeatureCollection: fc,
    });

    expect(intersection).toBeUndefined();
  });
});
