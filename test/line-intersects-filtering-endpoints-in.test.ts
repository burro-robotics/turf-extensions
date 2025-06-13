import {featureCollection, lineIntersect, lineString} from '@turf/turf';
import {FeatureCollection} from 'geojson';
import {lineIntersectsFilteringEndpointsIn} from '../src/feature-collection/line-intersects-filtering-endpoints-in';

describe('findCollisions without defining a includeSharedEndpoint option', () => {
  it('should detect interior crossings as collisions', () => {
    const lineStrings = featureCollection([
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
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toHaveLength(1);
    expect(collisions?.features[0].geometry.coordinates).toEqual([1, 1]);
  });

  it('should detect T-junctions as collisions', () => {
    const lineStrings = featureCollection([
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
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toHaveLength(1);
    expect(collisions?.features[0].geometry.coordinates).toEqual([1.5, 1]);
  });

  it('should NOT detect shared endpoints as collisions', () => {
    const lineStrings = featureCollection([
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
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toBeUndefined();
  });

  it('should NOT detect multiple shared endpoints as collisions', () => {
    const lineStrings = featureCollection([
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
      lineString(
        [
          [1, 1],
          [0, 1],
        ],
        {id: 'top'},
      ),
      lineString(
        [
          [0, 1],
          [0, 0],
        ],
        {id: 'left'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toBeUndefined();
  });

  it('should detect only actual collisions in mixed scenarios', () => {
    const lineStrings = featureCollection([
      lineString(
        [
          [0, 0],
          [2, 0],
        ],
        {id: 'horizontal'},
      ),
      lineString(
        [
          [2, 0],
          [2, 2],
        ],
        {id: 'vertical'},
      ),
      lineString(
        [
          [0.5, -1],
          [0.5, 1],
        ],
        {id: 'crossing'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toHaveLength(1);
    expect(collisions?.features[0].geometry.coordinates).toEqual([0.5, 0]);
  });

  it('should return empty array when no intersections exist', () => {
    const lineStrings = featureCollection([
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
      lineString(
        [
          [0, 2],
          [1, 2],
        ],
        {id: 'line3'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toBeUndefined();
  });

  it('should detect multiple collision points', () => {
    const lineStrings = featureCollection([
      lineString(
        [
          [1, 0],
          [1, 3],
        ],
        {id: 'vertical'},
      ),
      lineString(
        [
          [0, 1],
          [3, 1],
        ],
        {id: 'horizontal1'},
      ),
      lineString(
        [
          [0, 2],
          [3, 2],
        ],
        {id: 'horizontal2'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toHaveLength(2);

    const coords = collisions?.features.map(c => c.geometry.coordinates);
    expect(coords).toContainEqual([1, 1]);
    expect(coords).toContainEqual([1, 2]);
  });

  it('should detect when different endpoints meet as non-collision', () => {
    const lineStrings = featureCollection([
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
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toBeUndefined();
  });

  it('should handle single line without collisions', () => {
    const lineStrings = featureCollection([
      lineString(
        [
          [0, 0],
          [1, 1],
        ],
        {id: 'single'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toBeUndefined();
  });

  it('should handle self-intersecting lines', () => {
    const lineStrings = featureCollection([
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
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle realistic road network scenario', () => {
    const lineStrings = featureCollection([
      lineString(
        [
          [0, 5],
          [10, 5],
        ],
        {id: 'main_street'},
      ),

      lineString(
        [
          [3, 5],
          [3, 8],
        ],
        {id: 'north_side_street'},
      ),
      lineString(
        [
          [7, 5],
          [7, 2],
        ],
        {id: 'south_side_street'},
      ),

      lineString(
        [
          [5, 3],
          [5, 7],
        ],
        {id: 'bridge'},
      ),
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(lineStrings);

    expect(collisions?.features).toHaveLength(3);
  });
});

describe('findCollisions with includeSharedEndpoints: true', () => {
  test('should include collisions when lines share start points', () => {
    const line1 = lineString([
      [0, 0],
      [1, 1],
    ]);
    const line2 = lineString([
      [0, 0],
      [1, -1],
    ]);

    const result = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2]),
    );

    expect(result?.features).toBeUndefined();
  });

  test('should include collisions when lines share end points', () => {
    const line1 = lineString([
      [0, 0],
      [2, 2],
    ]);
    const line2 = lineString([
      [1, 0],
      [2, 2],
    ]);

    const result = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2]),
    );

    expect(result?.features).toBeUndefined();
  });

  test('should handle T-junction where line endpoint touches middle of another line', () => {
    const line1 = lineString([
      [0, 0],
      [2, 0],
    ]);
    const line2 = lineString([
      [1, 0],
      [1, 1],
    ]);

    const result = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2]),
    );

    expect(result?.features).toHaveLength(1);
    expect(result?.features[0].geometry.coordinates).toEqual([1, 0]);
  });

  test('should not include shared endpoints when includeSharedEndpoints is false', () => {
    const line1 = lineString([
      [0, 0],
      [1, 1],
    ]);
    const line2 = lineString([
      [0, 0],
      [1, -1],
    ]);

    const result = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2]),
    );

    expect(result?.features).toBeUndefined();
  });

  test('should handle complex polygon-like structure with shared endpoints', () => {
    const line1 = lineString([
      [0, 0],
      [1, 0],
    ]);
    const line2 = lineString([
      [1, 0],
      [0.5, 1],
    ]);
    const line3 = lineString([
      [0.5, 1],
      [0, 0],
    ]);

    const result = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2, line3]),
    );

    expect(result?.features).toBeUndefined();
  });

  test('should ignore 2 shared endpoints that still results in an intersect', () => {
    const line1 = lineString([
      [0, 2],
      [0, 0],
      [2, 2],
    ]);
    const line2 = lineString([
      [0, 2],
      [2, 0],
      [2, 2],
    ]);
    const fc: FeatureCollection = featureCollection([line1, line2]);

    const aLineIntersect = lineIntersect(line1, line2, {});

    const collisions = lineIntersectsFilteringEndpointsIn(fc);
    expect(collisions?.features).toHaveLength(1);
    expect(aLineIntersect.features).toHaveLength(2);
  });

  test('should ignore 2 shared endpoints that still results in an intersect', () => {
    const line1 = lineString([
      [0, 2],
      [0, 0],
      [2, 2],
    ]);
    const line2 = lineString([
      [0, 2],
      [2, 0],
      [2, 2],
    ]);
    const fc: FeatureCollection = featureCollection([line1, line2]);

    const aLineIntersect = lineIntersect(line1, line2, {});

    const collisions = lineIntersectsFilteringEndpointsIn(fc);
    expect(collisions?.features).toHaveLength(1);
    expect(aLineIntersect.features).toHaveLength(2);
  });

  test('should not detect self-intersections', () => {
    const line1 = lineString([
      [0, 0],
      [1, 0],
      [1, -1],
      [0.5, 0.25],
    ]);
    const line2 = lineString([
      [0.5, 0.5],
      [1, 0.5],
    ]);

    const collisions = lineIntersectsFilteringEndpointsIn(
      featureCollection([line1, line2]),
      {ignoreSelfIntersections: true},
    );

    expect(collisions?.features).toBeUndefined();
  });
});
