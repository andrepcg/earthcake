import { combineReducers } from 'redux';
import { pick } from 'lodash';

import {
  FETCH_EVENTS,
  RECEIVE_EVENTS,
  RECEIVE_EVENT_NEARBY,
  // FETCH_EVENT_NEARBY,
  FETCH_EVENT_DETAILS,
  RECEIVE_EVENT_DETAILS,
  RECEIVE_NEARBY,
  FETCH_NEARBY,
  CLEAR_NEARBY
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

  if (action.type === RECEIVE_EVENT_NEARBY) {
    return {
      ...state,
      nearby: action.data.map((e) => e.id)
    };
  }

  return state;
}

function eventArrayToObject(array, action) {
  const obj = {};
  array.forEach((e) => {
    obj[e.id] = event(e, action);
  });
  return obj;
}

function data(state = {}, action) {
  if (action.type === RECEIVE_EVENTS) {
    return {
      ...state,
      ...eventArrayToObject(action.data, action)
    };
  }

  if (action.type === RECEIVE_NEARBY) {
    return {
      ...state,
      ...eventArrayToObject(action.data, action)
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

  if (action.type === RECEIVE_EVENT_NEARBY) {
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

function nearby(state = { isLoading: true, data: [] }, action) {
  if (action.type === FETCH_NEARBY || action.type === CLEAR_NEARBY) {
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
  nearby
});
