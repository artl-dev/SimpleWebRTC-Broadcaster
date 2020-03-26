/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Preview extends Component {
  static propTypes = {
    imageSrc: PropTypes.string.isRequired,
  };

  render() {
    const { imageSrc } = this.props;

    return (
      <section id="previewWrapper">
        <img
          className="pagePreviewImg"
          src={imageSrc}
          alt="preview screenshot"
        />
      </section>
    );
  }
}
