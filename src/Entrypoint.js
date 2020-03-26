import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, Actions, Selectors } from '@andyet/simplewebrtc';

import App from './App';

const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${process.env.REACT_APP_API_KEY}`;

const store = createStore();
window.store = store;
window.actions = Actions;
window.selectors = Selectors;

export default class Entrypoint extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <App configUrl={CONFIG_URL} />
        </Router>
      </Provider>
    );
  }
}
