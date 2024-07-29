import { describe, it } from "@jest/globals";
import type { Position } from "geojson";
import { coordinatesCalculatedAngularChanges } from "./coordinatesCalculatedAngularChanges";

describe("coordinatesCalculatedAngles", () => {
  it("should handle a straight line along 0", () => {
    let coordinates: Position[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    let angles = coordinatesCalculatedAngularChanges({
      coordinates,
    });

    expect(angles).toEqual([0, 0, 0]);
  });

  it("handle a straight 45deg line", () => {
    let coordinates = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];

    let angles = coordinatesCalculatedAngularChanges({
      coordinates,
    });

    expect(angles).toEqual([0, 0, 0]);
  });

  it("should calculate with three points forming a right angle", () => {
    let coordinates = [
      [1, 0],
      [0, 0],
      [0, 1],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 90, 0]);
  });

  it("should calculate with collinear points in a horizontal line", () => {
    let coordinates = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 0, 0]);
  });

  it("should calculate with collinear points in a vertical line", () => {
    let coordinates = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 0, 0]);
  });

  it("should calculate with negative coordinates", () => {
    let coordinates = [
      [-1, -1],
      [0, 0],
      [1, 1],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 0, 0]);
  });

  it("should calculate with an acute angle", () => {
    let coordinates = [
      [0, 0],
      [1, 0],
      [2, 1],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 45, 0]);
  });

  it("should calculate with only two points (should handle or throw an error depending on your implementation)", () => {
    let coordinates = [
      [0, 0],
      [1, 1],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 0]); // Assuming it defaults to 0 when insufficient points for angle calculation
  });

  it("should calculate with points that form a full circle", () => {
    let coordinates = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    let angles = coordinatesCalculatedAngularChanges({ coordinates });
    expect(angles).toEqual([0, 90, 90, 0]);
  });
});
