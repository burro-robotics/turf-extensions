import {coordinatesCalculatedAngularChanges} from '@/coordinates/coordinates-calculated-angular-changes';
import type {Position} from 'geojson';

describe('coordinatesCalculatedAngles', () => {
  it('should handle a straight line along 0', () => {
    const coordinates: Position[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const angles = coordinatesCalculatedAngularChanges({
      coordinates,
    });

    expect(angles).toEqual([0, 0, 0]);
  });

  it('handle a straight 45deg line', () => {
    const coordinates = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];

    const angles = coordinatesCalculatedAngularChanges({
      coordinates,
    });

    expect(angles).toEqual([0, 0, 0]);
  });

  it('should calculate with three points forming a right angle', () => {
    const coordinates = [
      [1, 0],
      [0, 0],
      [0, 1],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 90, 0]);
  });

  it('should calculate with collinear points in a horizontal line', () => {
    const coordinates = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 0, 0]);
  });

  it('should calculate with collinear points in a vertical line', () => {
    const coordinates = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 0, 0]);
  });

  it('should calculate with negative coordinates', () => {
    const coordinates = [
      [-1, -1],
      [0, 0],
      [1, 1],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 0, 0]);
  });

  it('should calculate with an acute angle', () => {
    const coordinates = [
      [0, 0],
      [1, 0],
      [2, 1],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 45, 0]);
  });

  it('should calculate with only two points (should handle or throw an error depending on your implementation)', () => {
    const coordinates = [
      [0, 0],
      [1, 1],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 0]); // Assuming it defaults to 0 when insufficient points for angle calculation
  });

  it('should calculate with points that form a full circle', () => {
    const coordinates = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const angles = coordinatesCalculatedAngularChanges({coordinates});
    expect(angles).toEqual([0, 90, 90, 0]);
  });
});
