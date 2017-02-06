import request from 'superagent';
import moment from 'moment';

import { coordinatesToLocation } from '../util/geocode';

export const FETCH_EVENTS = "FETCH_EVENTS";
export const FETCH_EVENT_DETAILS = "FETCH_EVENT_DETAILS";
export const RECEIVE_EVENT_DETAILS = "RECEIVE_EVENT_DETAILS";
export const RECEIVE_EVENTS = "RECEIVE_EVENTS";
export const FETCH_EVENT_NEARBY = "FETCH_EVENT_NEARBY";
export const RECEIVE_EVENT_NEARBY = "RECEIVE_EVENT_NEARBY";
export const FETCH_NEARBY = "FETCH_NEARBY";
export const RECEIVE_NEARBY = "RECEIVE_NEARBY";
export const CLEAR_NEARBY = "CLEAR_NEARBY";

function getEarthquakes(params) {
  return request
    .get('http://earthcake.herokuapp.com/api/earthquakes/find')
    .set('Accept', 'application/json')
    .query(params);
}

const startOfDay = moment().startOf('day');
const startOfWeek = moment().startOf('week');

export function getWeekEvents() {
  return function (dispatch) {
    dispatch({ type: FETCH_EVENTS });
    getEarthquakes({ since: startOfWeek.unix() })
      .then(
        (response) => dispatch({ type: RECEIVE_EVENTS, ...response.body })
      );
  };
}

export function getAllEvents() {
  return function (dispatch) {
    // dispatch({ type: FETCH_EVENTS });
    return request
      .get('http://earthcake.herokuapp.com/api/earthquakes/')
      .set('Accept', 'application/json')
      .then(
        (response) => dispatch({ type: RECEIVE_EVENTS, ...response.body })
      );
  };
}

export function getDayEvents() {
  return function (dispatch) {
    dispatch({ type: FETCH_EVENTS });
    getEarthquakes({ since: startOfDay.unix() })
      .then(
        (response) => dispatch({ type: RECEIVE_EVENTS, ...response.body })
      );
  };
}


export function getEventDetails(eventId) {
  return function (dispatch) {
    dispatch({ type: FETCH_EVENT_DETAILS, eventId });
    return request
      .get('http://earthcake.herokuapp.com/api/earthquakes/' + eventId)
      .set('Accept', 'application/json')
      .then((response) => {
        dispatch({ type: RECEIVE_EVENT_DETAILS, ...response.body });

        const coords = response.body.data.geometry.coordinates;
        coordinatesToLocation(coords[1], coords[0]).then((res) => {
          dispatch({ type: RECEIVE_EVENT_DETAILS, data: { id: eventId, location: res } });
        });
      });
  };
}

export function getEventNearby(eventId) {
  return function (dispatch) {
    dispatch({ type: FETCH_EVENT_NEARBY, eventId });
    request
      .get(`http://earthcake.herokuapp.com/api/earthquakes/${eventId}/nearby`)
      .set('Accept', 'application/json')
      .then((response) => dispatch({ type: RECEIVE_EVENT_NEARBY, ...response.body }));
  };
}

export function getNearby(lat, long, radius) {
  return function (dispatch) {
    dispatch({ type: FETCH_NEARBY });
    request
      .get('http://earthcake.herokuapp.com/api/earthquakes/findByCoords')
      .set('Accept', 'application/json')
      .query({ lat, long, radius })
      .then(
        (response) => dispatch({ type: RECEIVE_NEARBY, ...response.body })
      );
  };
}

export function clearNearby() {
  return { type: CLEAR_NEARBY };
}