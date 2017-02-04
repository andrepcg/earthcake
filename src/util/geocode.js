import request from 'superagent';
import { forEach, includes } from 'lodash';

import { MAPBOX_PUBLIC_TOKEN } from '../config';

export function locationImage({lat, lng, zoom = 9}) {
  return `url(https://api.mapbox.com/v4/mapbox.satellite/${lng},${lat},${zoom}/1206x268.png?access_token=${MAPBOX_PUBLIC_TOKEN})`;
}


export function locationToCoordinates(country, city) {
  const c = city ? `,${city}` : '';
  return request
    .get('http://maps.googleapis.com/maps/api/geocode/json')
    .set('Accept', 'application/json')
    .query({ address: `${country}${c}` })
    .then(
      (response) => {
        const { results } = response.body;
        const result = results[0].geometry;
        return {
          coordinates: [
            result.location.lat,
            result.location.lng
          ] ,
          bounds: results.bounds
        };
      },
      (failure) => {
        throw failure;
      }
    );
}

export function coordinatesToLocation(latitude, longitude) {
  return request
    .get('http://maps.googleapis.com/maps/api/geocode/json')
    .set('Accept', 'application/json')
    .query({ latlng: `${latitude},${longitude}` })
    .then(
      (response) => {
        const { results } = response.body;
        const object = {
          country: {
            name: '',
            bounds: {}
          },
          city: {
            name: '',
            bounds: {}
          }
        };

        forEach(results, (location) => {
          if (includes(location.types, 'country')) {
            object.country.name = location.formatted_address;
            object.country.bounds = location.geometry.bounds;
          }
          else if (includes(location.types, 'administrative_area_level_2')) {
            object.city.name = location.address_components[0].long_name;
            object.city.bounds = location.geometry.bounds;
          }
        });

        return object;
      },
      (failure) => {
        throw failure;
      }
    );
}