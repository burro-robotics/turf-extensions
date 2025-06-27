import {lineString} from '@turf/turf';
import {lineIntersectFilteringEndpoints} from '../src/line/line-intersect-filtering-endpoints';

describe('findCollisions without defining a includeSharedEndpoint option', () => {
  it('should detect interior crossings as collisions', () => {
    const collisions = lineIntersectFilteringEndpoints(
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
    );

    expect(collisions?.features).toHaveLength(1);
    expect(collisions?.features[0].geometry.coordinates).toEqual([1, 1]);
  });

  it('should detect T-junctions as collisions', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 1],
          [3, 1],
        ],
        {id: 'main_road'},
      ),
      lineString(
        [
          [1.5, 0],
          [1.5, 1],
        ],
        {id: 'side_road'},
      ),
    );

    expect(collisions?.features).toHaveLength(1);
    expect(collisions?.features[0].geometry.coordinates).toEqual([1.5, 1]);
  });

  it('should NOT detect shared endpoints as collisions', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 0],
          [1, 1],
        ],
        {id: 'segment1'},
      ),
      lineString(
        [
          [1, 1],
          [2, 0],
        ],
        {id: 'segment2'},
      ),
    );

    expect(collisions?.features).toBeUndefined();
  });

  it('should NOT detect multiple shared endpoints as collisions', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 0],
          [1, 0],
        ],
        {id: 'bottom'},
      ),
      lineString(
        [
          [1, 0],
          [1, 1],
        ],
        {id: 'right'},
      ),
    );

    expect(collisions?.features).toBeUndefined();
  });

  it('should return empty array when no intersections exist', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 0],
          [1, 0],
        ],
        {id: 'line1'},
      ),
      lineString(
        [
          [2, 0],
          [3, 0],
        ],
        {id: 'line2'},
      ),
    );

    expect(collisions?.features).toBeUndefined();
  });

  it('should detect when different endpoints meet as non-collision', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 0],
          [1, 0],
        ],
        {id: 'line1'},
      ),
      lineString(
        [
          [2, 1],
          [1, 0],
        ],
        {id: 'line2'},
      ),
    );

    expect(collisions?.features).toBeUndefined();
  });

  it('should handle self-intersecting lines', () => {
    const collisions = lineIntersectFilteringEndpoints(
      lineString(
        [
          [0, 0],
          [2, 2],
          [2, 0],
          [0, 2],
        ],
        {id: 'self_intersecting'},
      ),
      lineString(
        [
          [3, 0],
          [4, 1],
        ],
        {id: 'separate'},
      ),
    );

    expect(collisions?.features.length).toBeGreaterThanOrEqual(1);
  });
});
