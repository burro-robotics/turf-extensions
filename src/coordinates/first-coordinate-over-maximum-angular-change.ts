import type {Position} from 'geojson';

export function firstCoordinateOverMaximumAngularChange({
  coordinates,
  maximumAngularChange,
}: {
  coordinates: Position[];
  maximumAngularChange: number;
}): Position | undefined {
  if (coordinates.length < 3) {
    return undefined;
  }

  let previousAngle = Math.atan2(
    coordinates[1][1] - coordinates[0][1],
    coordinates[1][0] - coordinates[0][0],
  );

  for (let i = 1; i < coordinates.length - 1; i++) {
    const p2 = coordinates[i];
    const p3 = coordinates[i + 1];

    const currentAngle = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]);
    let angleChange =
      ((currentAngle - previousAngle) * (180 / Math.PI) + 360) % 360;
    angleChange = angleChange > 180 ? 360 - angleChange : angleChange;

    if (angleChange > maximumAngularChange) {
      return coordinates[i];
    }

    previousAngle = currentAngle;
  }

  return undefined;
}
