/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable function-paren-newline */
import React, { Component } from 'react';
import { Button, Label, Input, FormGroup, Form } from 'reactstrap';
import * as dateFns from 'date-fns';
import Sound from 'react-sound';
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
      broadcasting: false,
      roomName: localStorage.getItem('room') || '',
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
    this.startBroadcast = this.startBroadcast.bind(this);
    this.stopBroadcast = this.stopBroadcast.bind(this);
    this.takeScreenshot = this.takeScreenshot.bind(this);
  }

  componentWillUnmount() {
    this.stopBroadcast();
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

  startBroadcast = () => {
    let { roomName } = this.state;
    if (!roomName) {
      roomName = this.roomName ? this.roomName : '';
      localStorage.setItem('room', roomName);
    }
    if (roomName) {
      this.setState({
        broadcasting: true,
        roomName,
      });
    }
  };

  stopBroadcast = () => {
    // this.props.leaveRoom(roomAddress);
    this.setState({ broadcasting: false, roomName: '' });
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

  updateRoomName = roomName => {
    this.roomName = roomName;
  };

  render() {
    const { broadcasting, roomName, shouldPlaySound } = this.state;

    return (
      <Provider configUrl={CONFIG_URL}>
        <section id="broadcastWrapper">
          {!broadcasting ? (
            <div>
              <div className="videoActionsWrapper">
                {!roomName && (
                  <Form>
                    <FormGroup>
                      <Label for="exampleEmail">Channel name:</Label>
                      <Input
                        type="text"
                        name="channelName"
                        onChange={evt => this.updateRoomName(evt.target.value)}
                      />
                    </FormGroup>
                  </Form>
                )}
              </div>
              <div className="videoActionsWrapper">
                <Button color="success" onClick={this.startBroadcast}>
                  View my pEEp
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
                <RequestUserMedia audio video auto mirrored={false} />
                <Room name={roomName} password="">
                  {({ room, localMedia }) => {
                    if (!room.joined) {
                      return <h1>Preparing...</h1>;
                    }

                    const localVideos = localMedia.filter(
                      m => m.kind === 'video' && m.shared,
                    );
                    // const remoteVideos = remoteMedia.filter(
                    //   m => m.kind === 'video',
                    // );

                    console.log(localVideos);

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
                            onClick={() => this.stopBroadcast(room.address)}
                          >
                            Stop your feed
                          </Button>
                        </div>
                        <div className="videoWrapper">
                          <Video
                            media={localVideos[0]}
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

          {roomName && (
            <div className="channelName">
              <h5>Channel name: {roomName}</h5>
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

export default Broadcast;
