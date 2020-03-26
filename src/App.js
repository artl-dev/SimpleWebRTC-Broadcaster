import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import Sidebar from './Components/Sidebar';
import Local from './Components/Local';
import Remote from './Components/Remote';
import Gallery from './Components/Gallery';
import Preview from './Components/Preview';
// import Discover from './Components/Discover';
import NoMatch from './Components/NoMatch';

import sideBarLinks from './sidebar_def';
// import comingSoon from './assets/coming-soon.jpg';
import DiscoverPng from './assets/Discover1.png';
import ForumPng from './assets/Forum1.png';
import PeepPagePng from './assets/pEEpPage1.png';
import SciencePng from './assets/Science1.png';
import StorePng from './assets/Store1.png';
import KidsPng from './assets/Kids1.png';

class App extends Component {
  render() {
    return (
      <div id="App">
        <main id="contentSection">
          <div>
            <div id="backgroundOverlay">
              <div id="mainBody">
                <header>
                  <div className="leftside">
                    <div id="textlogoWrapper">
                      <div className="top"> </div>
                    </div>
                  </div>
                  <div className="middle">
                    <div id="textlogoWrapper">
                      <div className="top">pEEpHome</div>
                    </div>
                  </div>
                  <div className="rightside" />
                </header>
                <main>
                  <Sidebar links={sideBarLinks} />
                  <Switch>
                    <Route exact path="/" component={() => <Local />} />
                    <Route exact path="/shared" component={() => <Remote />} />
                    <Route
                      exact
                      path="/gallery"
                      component={() => <Gallery />}
                    />
                    <Route
                      exact
                      path="/pEEpLog"
                      component={() => <Preview imageSrc={PeepPagePng} />}
                    />
                    <Route
                      exact
                      path="/pEEpForum"
                      component={() => <Preview imageSrc={ForumPng} />}
                    />
                    <Route
                      exact
                      path="/pEEpKids"
                      component={() => <Preview imageSrc={KidsPng} />}
                    />
                    <Route
                      exact
                      path="/discover"
                      component={() => <Preview imageSrc={DiscoverPng} />}
                    />
                    <Route
                      exact
                      path="/science"
                      component={() => <Preview imageSrc={SciencePng} />}
                    />
                    <Route
                      exact
                      path="/store"
                      component={() => <Preview imageSrc={StorePng} />}
                    />
                    <Route component={NoMatch} />
                  </Switch>
                  <aside />
                </main>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(App);
