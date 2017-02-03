import { combineReducers } from 'redux';
import { pick, filter } from 'lodash';
import moment from 'moment';

import {
  FETCH_EVENTS,
  RECEIVE_EVENTS,
  RECEIVE_EVENT_NEARBY,
  FETCH_EVENT_NEARBY,
  FETCH_EVENT_DETAILS,
  RECEIVE_EVENT_DETAILS,
  RECEIVE_NEARBY,
  FETCH_NEARBY
} from '../actions/events';

function event(state = {}, action) {
  if (action.type === RECEIVE_EVENTS) {
    return {
      ...pick(state, ['id', 'mag', 'time', 'geometry', 'place']),
      isLoading: false
    };
  }

  if (action.type === FETCH_EVENT_DETAILS) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === RECEIVE_EVENT_DETAILS) {
    return {
      ...state,
      isLoading: false
    };
  }

  return state;
}

function data(state = {}, action) {
  if (action.type === RECEIVE_EVENTS) {
    return {
      ...state,
      ...action.data.reduce((ac, t) => ({
        ...ac, [t.id]: event({ ...state[t.id], ...t }, action) }),
        {}
      )
    };
  }

  if (action.type === RECEIVE_NEARBY) {
    return {
      ...state,
      ...action.data.reduce((ac, t) => ({
        ...ac, [t.id]: event(t, action) }),
        {}
      )
    };
  }

  if (action.type === FETCH_EVENT_DETAILS) {
    return {
      ...state,
      [action.eventId]: event(state[action.eventId], action)
    };
  }

  if (action.type === RECEIVE_EVENT_DETAILS) {
    return {
      ...state,
      [action.data.id]: event({ ...state[action.data.id], ...action.data }, action)
    };
  }


  return state;
}

function isLoading(state = true, action) {
  if (action.type === FETCH_EVENTS) {
    return true;
  }

  if (action.type === RECEIVE_EVENTS) {
    return false;
  }

  return state;
}

const startOfDay = moment().startOf('day');
const startOfWeek = moment().startOf('week');

function daily(state = [], action) {
  if (action.type === RECEIVE_EVENTS) {
    return [
      ...filter(action.data,
        (e) => moment(e.time).isAfter(startOfDay)
      ).map((e) => e.id)
    ];
  }

  return state;
}

function weekly(state = [], action) {
  if (action.type === RECEIVE_EVENTS) {
    return [
      ...filter(action.data,
        (e) => moment(e.time).isAfter(startOfWeek)
      ).map((e) => e.id)
    ];
  }
  return state;
}

function nearby(state = {}, action) {
  if (action.type === FETCH_NEARBY) {
    return {
      isLoading: true,
      data: []
    };
  }

  if (action.type === RECEIVE_NEARBY) {
    return {
      isLoading: false,
      data: action.data.map((e) => e.id)
    };
  }

  return state;
}

export default combineReducers({
  isLoading,
  data,
  daily,
  weekly,
  nearby
});
