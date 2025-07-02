import {FeatureCollection, LineString} from 'geojson';
import {firstCoordinateOverMaximumAngularChange} from '../src/coordinates/first-coordinate-over-maximum-angular-change';

describe('merge-extended-line-strings', () => {
  it('should merge extended line strings', () => {
    const geojsonString = `
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "72ef0aca-c554-422c-a79e-5f6c1bab7c7d",
      "properties": {
        "direction": "two_way",
        "speed_limit": 1.2
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -75.13969994983165,
            39.94895006289354
          ],
          [
            -75.1395804635161,
            39.94928592955533
          ],
          [
            -75.13964684480248,
            39.948940612076186
          ]
        ]
      }
    }
  ]
}
`;

    const aFeatureCollection: FeatureCollection<LineString> =
      JSON.parse(geojsonString);
    const aFirstCoordinateOverMaximumAngularChange =
      firstCoordinateOverMaximumAngularChange({
        coordinates: aFeatureCollection.features[0].geometry.coordinates,
        maximumAngularChange: 30,
      });
    expect(aFirstCoordinateOverMaximumAngularChange).toBeDefined();
  });
});
