import {mergeExtendedLineStrings} from '../src/feature-collection/merge-extended-line-strings';

describe('merge-extended-line-strings', () => {
  it('should merge extended line strings', () => {
    const geojsonString = `
{
  "id": "A",
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#0000ff",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            2
          ],
          [
            0,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "id": "B",
      "type": "Feature",
      "properties": {
        "stroke": "#ff0000",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            1
          ],
          [
            0,
            2
          ]
        ],
        "type": "LineString"
      }
    }
  ]
}
`;

    const aFeatureCollection = JSON.parse(geojsonString);
    const merged = mergeExtendedLineStrings({
      inFeatureCollection: aFeatureCollection,
      options: {
        allowMergingAtIntersections: false,
      },
    });
    expect(merged.features.length).toBe(1);
  });

  it('should merge extended line strings while leaving other features alone', () => {
    const geojsonString = `
{
  "id": "A",
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#0000ff",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            2
          ],
          [
            0,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "id": "B",
      "type": "Feature",
      "properties": {
        "stroke": "#ff0000",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            1
          ],
          [
            0,
            2
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "id": 2,
      "type": "Feature",
      "properties": {
        "stroke": "#00ff00",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            -1,
            3
          ],
          [
            0,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "id": "D",
      "type": "Feature",
      "properties": {
        "stroke": "#ffff00",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            3
          ],
          [
            1,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              0,
              2
            ],
            [
              0,
              1
            ],
            [
              1,
              2
            ],
            [
              0,
              2
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          -0.5,
          1.5
        ],
        "type": "Point"
      }
    }
  ]
} 
`;

    const aFeatureCollection = JSON.parse(geojsonString);
    const merged = mergeExtendedLineStrings({
      inFeatureCollection: aFeatureCollection,
      options: {
        allowMergingAtIntersections: false,
      },
    });
    console.log(JSON.stringify(merged));
    expect(merged.features.length).toBe(5);
  });

  it('should merge triply extended line strings', () => {
    const geojsonString = `
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#00ff00",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            4
          ],
          [
            0,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#0000ff",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            2
          ],
          [
            0,
            3
          ]
        ],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#ff0000",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            0,
            1
          ],
          [
            0,
            2
          ]
        ],
        "type": "LineString"
      }
    }
  ]
}
`;

    const aFeatureCollection = JSON.parse(geojsonString);
    const merged = mergeExtendedLineStrings({
      inFeatureCollection: aFeatureCollection,
      options: {
        allowMergingAtIntersections: false,
      },
    });
    console.log(JSON.stringify(merged, null, 2));
    expect(merged.features.length).toBe(1);
  });
});
