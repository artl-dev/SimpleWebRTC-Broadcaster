import React, { Component } from 'react';
import audubon from '../assets/audubon.png';
import birdsleuth from '../assets/birdsleuth.png';
import cornel from '../assets/cornel.png';
import eBird from '../assets/eBird.png';
import feedwatch from '../assets/feedwatch.png';

export default class Discover extends Component {
  render() {
    return (
      <section id="discover">
        <main>
          <p>
            Did you know bird lovers make great citizen scientists? In fact,
            hundreds of thousands of people around the world contribute bird
            observations each year, gathering data on a scale once unimaginable.
          </p>
          <p>
            For kids, observing their own back-yard birds can be a spring-board
            toward a better understanding of the mechanisms of science and the
            importance of conservation.
          </p>
          <p>
            The Cornell Lab of Ornitholog, along with other important
            conservation entities, administers many cutting edge, data driven
            initiatives that get people involved and excited about contributing
            to citizen-science.
          </p>
        </main>
        <footer>
          <section>
            <h2>Bird Information and I.D.</h2>
            <img src={audubon} alt="audubon" />
            <img src={cornel} alt="cornel" />
          </section>
          <section>
            <h2>Citizen-science</h2>
            <img src={eBird} alt="eBird" />
            <img src={feedwatch} alt="feedwatch" />
            <a href="https://feederwatch.org/wp-content/uploads/2013/08/TallySheet.pdf">
              Printable Tally Sheet
            </a>
          </section>
          <section>
            <h2>Kids citizen-science</h2>
            <img src={birdsleuth} alt="birdsleuth" />
            <a href="http://www.birdsleuth.org/wp-content/uploads/2015/02/Bird-Count-Tally-Sheet.pdf">
              Printable Tally Sheet
            </a>
          </section>
        </footer>
      </section>
    );
  }
}
