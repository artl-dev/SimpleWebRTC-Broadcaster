import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import Local from './Local';
import NoMatch from './NoMatch';

class App extends Component {
  render() {
    return (
      <div id="App">
        <main id="contentSection">
          <Switch>
            <Route exact path="/" component={Local} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default withRouter(App);
