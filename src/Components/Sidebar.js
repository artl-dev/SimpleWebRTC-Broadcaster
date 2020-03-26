/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const LinkType = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  activeClass: PropTypes.string,
};

const RenderNavlink = ({ url, title, activeClass = 'active' }) => (
  <NavLink to={url} key={`${url}-${title}`} exact activeClassName={activeClass}>
    {title}
  </NavLink>
);

RenderNavlink.propTypes = LinkType;

export default class Sidebar extends Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape(LinkType)),
  };

  render() {
    const { links } = this.props;

    return <section id="sidebar">{links.map(RenderNavlink)}</section>;
  }
}
