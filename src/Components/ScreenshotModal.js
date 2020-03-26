/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { FacebookShareButton, FacebookIcon } from 'react-share';

export default class ScreenshotModal extends Component {
  static propTypes = {
    screenshot: PropTypes.object,
    toggleScreenshotModal: PropTypes.func,
    saveScreenshot: PropTypes.func,
    fbShare: PropTypes.func,
    isScreenshotModalOpen: PropTypes.bool,
    galleryMode: PropTypes.bool,
    uploadedPercent: PropTypes.number,
    uploadedImageUrl: PropTypes.string,
  };

  renderFbShare() {
    const {
      galleryMode,
      uploadedPercent,
      fbShare,
      uploadedImageUrl,
    } = this.props;
    const uploading = parseInt(uploadedPercent, 10);

    if (!galleryMode) {
      return <div />;
    }

    if (Number.isNaN(uploading)) {
      return (
        <Button color="primary" onClick={fbShare}>
          Share on Facebook
        </Button>
      );
    }

    if (!Number.isNaN(uploading) && uploading < 100) {
      return (
        <Button disabled color="info">
          Uploading: {uploadedPercent}%
        </Button>
      );
    }

    if (uploading === 100 && !uploadedImageUrl) {
      return (
        <Button disabled color="info">
          Almost there...
        </Button>
      );
    }

    if (uploading === 100 && uploadedImageUrl) {
      return (
        <FacebookShareButton
          url={uploadedImageUrl}
          quote="Check out this awesome pEEp"
          hashtag="#pEEpFeeder"
        >
          <div className="finalFbShareBtn">
            <p>Click to share!</p>
            <FacebookIcon size={36} round />
          </div>
        </FacebookShareButton>
      );
    }

    return <div />;
  }

  render() {
    const {
      isScreenshotModalOpen,
      toggleScreenshotModal,
      saveScreenshot,
      screenshot,
      galleryMode,
    } = this.props;
    const imageSource = screenshot.src || screenshot.data;

    return (
      <div id="screenshotModal">
        <Modal
          size="lg"
          isOpen={isScreenshotModalOpen}
          toggle={toggleScreenshotModal}
        >
          <ModalHeader toggle={toggleScreenshotModal}>
            {screenshot.name}
          </ModalHeader>
          <ModalBody>
            <div className="hvCenter">
              <img alt="screenshot" id="screenshotImage" src={imageSource} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                window.alert('Not available yet');
              }}
            >
              Save to my pEEpPage
            </Button>
            <a
              className="btn btn-secondary"
              type="image/png"
              download={screenshot.name}
              href={imageSource}
            >
              Download Image
            </a>{' '}
            {!galleryMode && (
              <Button color="primary" onClick={saveScreenshot}>
                Save in pEEpLog
              </Button>
            )}
            {this.renderFbShare()}
            <Button color="secondary" onClick={toggleScreenshotModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
