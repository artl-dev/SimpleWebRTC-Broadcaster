/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable arrow-parens */
import React, { Component } from 'react';
import classnames from 'classnames';

import { setupDb, uploadImage } from '../util';
import ScreenshotModal from './ScreenshotModal';

const pageSize = 9;

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.db = setupDb();
    this.db.screenshots.each(s => {
      const { images } = this.state;
      images.push(s);
      this.setState({ images });
    });
    this.state = {
      currentPage: 1,
      images: [],
      selectedImage: {
        data: null,
        name: '',
      },
      uploadedPercent: null,
      uploadedImageUrl: '',
      isScreenshotModalOpen: false,
    };

    this.onThumbnailClicked = this.onThumbnailClicked.bind(this);
    this.setPage = this.setPage.bind(this);
    this.toggleScreenshotModal = this.toggleScreenshotModal.bind(this);
    this.fbShare = this.fbShare.bind(this);
  }

  onThumbnailClicked(image) {
    this.setState({ selectedImage: image });
    this.toggleScreenshotModal();
  }

  get hasPrevPage() {
    return this.state.currentPage > 1;
  }

  get hasNextPage() {
    return this.state.currentPage <= this.pageCount;
  }

  get visibleImages() {
    const start = (this.state.currentPage - 1) * pageSize;
    const end = start + pageSize;

    return this.state.images.slice(start, end);
  }

  get pageCount() {
    return Math.floor(this.state.images.length / pageSize);
  }

  setPage(currentPage) {
    this.setState({ currentPage });
  }

  toggleScreenshotModal() {
    this.setState({ isScreenshotModalOpen: !this.state.isScreenshotModalOpen });
    this.setState({ uploadedImageUrl: '' });
    this.setState({ uploadedPercent: NaN });
  }

  async fbShare() {
    try {
      const identifier = await uploadImage(
        this.state.selectedImage.data,
        progress => {
          const { loaded, total } = progress;

          this.setState({
            uploadedPercent: Math.round((loaded / total) * 100),
          });
        },
      );

      this.setState({ uploadedImageUrl: `https://i.imgur.com/${identifier}` });
    } catch (e) {
      // TODO Handle UI indication
      console.log(e);
    }
  }

  render() {
    const images = this.visibleImages;

    return (
      <div id="__page_gallery">
        <section id="galleryWrapper">
          {images.map(image => (
            <div key={image.name} className="galleryItem">
              <img
                src={image.data}
                alt={image.name}
                onClick={() => this.onThumbnailClicked(image)}
              />
            </div>
          ))}
        </section>

        <section id="pagination">
          <div
            className={classnames('navlink', { isActive: this.hasPrevPage })}
            onClick={() => {
              this.setPage(this.state.currentPage - 1);
            }}
          >
            Prev
          </div>
          <div>Page #{this.state.currentPage}</div>
          <div
            className={classnames('navlink', { isActive: this.hasNextPage })}
            onClick={() => {
              this.setPage(this.state.currentPage + 1);
            }}
          >
            Next
          </div>
        </section>

        <ScreenshotModal
          galleryMode
          fbShare={this.fbShare}
          uploadedImageUrl={this.state.uploadedImageUrl}
          isScreenshotModalOpen={this.state.isScreenshotModalOpen}
          toggleScreenshotModal={this.toggleScreenshotModal}
          screenshot={this.state.selectedImage}
          uploadedPercent={this.state.uploadedPercent}
        />
      </div>
    );
  }
}
