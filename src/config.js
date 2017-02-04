export const MAPBOX_SECRET_TOKEN = "sk.eyJ1IjoiYW5kcmVwY2ciLCJhIjoiY2l5cmFlNGFzMDAwczMzcWw2OGl4bXlrdiJ9.pd-L0WxZRXwLqFhMr6A96g";
export const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1IjoiYW5kcmVwY2ciLCJhIjoidjJ1cjhZOCJ9.YzcmaILJMSWz5GbMshr7yg";

const blueColour = '#4d8ab3';
export const blurPaint = {
    "circle-color": blueColour,
    "circle-opacity": {
        "base": 0.6,
        "stops": [
            [0, 0.1],
            [11, 0.6],
            [20, 1]
        ]
    },
    'circle-radius': {
        'property': 'mag',
        "base": 1.8,
        'stops': [
            [{zoom: 0,  value: 2}, 0.25],
            [{zoom: 0,  value: 8}, 32],
            [{zoom: 11, value: 2}, 2],
            [{zoom: 11, value: 8}, 2400],
            [{zoom: 20, value: 2}, 5],
            [{zoom: 20, value: 8}, 6000]
        ]
    },
    'circle-blur': {
        "base": 1.8,
        'property': 'mag',
        "stops": [
            [0, 1],
            [8, 0.6]
        ]
    }
};

export const dotPaint = {
  "circle-color": 'white',
  "circle-radius": {
      base: 1.1,
      stops: [
        [0, 0.6],
        [20, 10]
      ]
  }
}