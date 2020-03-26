/* eslint-disable react/destructuring-assignment */
/* eslint-disable lines-between-class-members */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React from 'react';

class Video extends React.Component {
  componentDidMount() {
    this.setup();
  }
  componentDidUpdate() {
    this.setup();
  }
  setup() {
    if (!this.props.media || !this.video) {
      return;
    }
    this.video.oncontextmenu = e => {
      e.preventDefault();
    };
    this.video.muted = true;
    if (this.video.srcObject !== this.props.media.stream) {
      this.video.srcObject = this.props.media.stream;
    }
  }
  render() {
    if (!this.props.media || !this.props.media.loaded) {
      return null;
    }
    return React.createElement('video', {
      ref: el => {
        this.video = el;
      },
      style:
        this.props.media && this.props.media.renderMirrored
          ? {
              transform: 'scaleX(-1)',
            }
          : {},
      playsInline: true,
      controls: true,
      autoPlay: true,
    });
  }
}

export default Video;
