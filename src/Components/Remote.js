/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable function-paren-newline */
import React, { Component } from 'react';
import * as dateFns from 'date-fns';
import Sound from 'react-sound';
import { connect } from 'react-redux';
import { Button, Form, Label, Input, FormGroup } from 'reactstrap';

import {
  Provider,
  Connected,
  Connecting,
  Disconnected,
  Room,
  RequestUserMedia,
  //  Video,
} from '@andyet/simplewebrtc';

import Video from './Video';
import ScreenshotModal from './ScreenshotModal';
import { takePhoto, setupDb } from '../util';

const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${process.env.REACT_APP_API_KEY}`;

class Broadcast extends Component {
  constructor(props) {
    super(props);
    this.db = setupDb();

    this.state = {
      receiving: false,
      roomName: '',
      shouldPlaySound: 'STOPPED',
      isScreenshotModalOpen: false,
      screenshot: {
        src: null,
        name: null,
      },
    };

    this.onSoundFinished = this.onSoundFinished.bind(this);
    this.playSound = this.playSound.bind(this);
    this.toggleScreenshotModal = this.toggleScreenshotModal.bind(this);
    this.updateScreenshot = this.updateScreenshot.bind(this);
    this.saveScreenshot = this.saveScreenshot.bind(this);
    this.startReceve = this.startReceve.bind(this);
    this.stopReceive = this.stopReceive.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
  }

  componentWillUnmount() {
    this.stopReceive();
  }

  onSoundFinished() {
    this.setState({ shouldPlaySound: 'STOPPED' });
  }

  playSound() {
    this.setState({ shouldPlaySound: 'PLAYING' });
  }

  toggleScreenshotModal() {
    this.setState({ isScreenshotModalOpen: !this.state.isScreenshotModalOpen });
  }

  updateScreenshot(src, name) {
    this.setState({ screenshot: { src, name } });
  }

  saveScreenshot() {
    this.db.screenshots.put({
      name: this.state.screenshot.name,
      data: this.state.screenshot.src,
    });
    this.setState({ isScreenshotModalOpen: false });
  }

  startReceve = () => {
    this.setState({ receiving: true });
  };

  stopReceive = () => {
    // this.props.leaveRoom(roomAddress);
    this.setState({ receiving: false, roomName: '' });
  };

  takeScreenshot = () => {
    const canvas = takePhoto(this.videoWrapper.video);
    const snapshot = canvas.toDataURL('image/png');
    const datetime = dateFns.format(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    const name = `screenshot-${datetime}.png`;

    this.updateScreenshot(snapshot, name);
    this.toggleScreenshotModal();
    this.playSound();
  };

  updateRemoteChannelName = roomName => {
    this.setState({ roomName });
  };

  render() {
    const { receiving, roomName, shouldPlaySound } = this.state;

    return (
      <Provider configUrl={CONFIG_URL}>
        <section id="broadcastWrapper">
          {!receiving ? (
            <div>
              <div className="videoActionsWrapper">
                <Form>
                  <FormGroup>
                    <Label for="exampleEmail">Channel name:</Label>
                    <Input
                      type="text"
                      name="channelName"
                      value={roomName}
                      onChange={evt =>
                        this.updateRemoteChannelName(evt.target.value)
                      }
                    />
                  </FormGroup>
                </Form>
              </div>
              <div className="videoActionsWrapper">
                <Button color="success" onClick={this.startReceve}>
                  Connect and view
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Connecting>Preparing...</Connecting>
              <Disconnected>
                <h1>Lost connection. Reattempting to join...</h1>
              </Disconnected>
              <Connected>
                <RequestUserMedia
                  audio
                  video
                  auto
                  mirrored={false}
                  share={false}
                />
                <Room name={roomName} password="">
                  {({ room, remoteMedia }) => {
                    if (!room.joined) {
                      return <h1>Preparing...</h1>;
                    }

                    const remoteVideos = remoteMedia.filter(
                      m => m.kind === 'video',
                    );

                    return (
                      <div>
                        <div className="videoActionsWrapper">
                          <Button
                            color="dark"
                            onClick={() => this.takeScreenshot()}
                          >
                            Capture an image
                          </Button>
                          <aside className="pad" />
                          <Button
                            color="secondary"
                            onClick={() => this.stopReceive(room.address)}
                          >
                            Stop your feed
                          </Button>
                        </div>
                        <div className="videoWrapper">
                          <Video
                            media={remoteVideos[0]}
                            ref={el => {
                              this.videoWrapper = el;
                            }}
                          />
                        </div>
                      </div>
                    );
                  }}
                </Room>
              </Connected>
            </div>
          )}

          <ScreenshotModal
            isScreenshotModalOpen={this.state.isScreenshotModalOpen}
            toggleScreenshotModal={() => this.toggleScreenshotModal()}
            saveScreenshot={this.saveScreenshot}
            screenshot={this.state.screenshot}
          />

          <Sound
            url="//freesound.org/data/previews/170/170229_3133582-lq.mp3"
            playStatus={shouldPlaySound}
            onFinishedPlaying={() => this.onSoundFinished()}
          />
        </section>
      </Provider>
    );
  }
}

export default connect(null, null)(Broadcast);
