import { createConnection, subscribeEntities } from 'home-assistant-js-websocket';
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import request from 'superagent';
import config from './config';

const exampleInitialState = {
  loaded: false,
  entities: {},
}

export const actionTypes = {
  UPDATE: 'UPDATE',
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE:
      return {
        ...state,
        loaded: true,
        entities: action.entities
      };
    default: return state
  }
}

// ACTIONS
export const load = () => dispatch => {
  return createConnection(config.socket, {
    authToken: config.password
  }).then(
    (conn) => {
      console.log('Connection established!');
      subscribeEntities(conn, entities => dispatch({ type: 'UPDATE', entities }));
    },
    err => console.error('Connection failed with code', err)
  )
}

export const callService = (domain, service, data) => dispatch => {
  return request.post(`${config.apiHost}/services/${domain}/${service}`, {
    ...data
  }).set({
    'x-ha-access': config.password
  }).then((result) => {
    return result;
  })
}

export const initStore = (initialState = exampleInitialState) => {
  const composeEnhancers = typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware)))
}
