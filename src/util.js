import Dexie from 'dexie';
import axios from 'axios';

export function takePhoto(video) {
  console.log(video);
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || video.clientWidth;
  canvas.height = video.videoHeight || video.clientHeight;

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export function setupDb() {
  const db = new Dexie('peep_db');

  db.version(1).stores({
    screenshots: '++id,name,data',
  });

  return db;
}

export function uploadImage(image, onUploadProgress) {
  const endpoint = 'https://api.imgur.com/3/image';
  const base64ImageContent = image.replace(
    /^data:image\/(png|jpg);base64,/,
    '',
  );
  const clientId = '3dbf8a4176399ad';

  const headers = {
    Authorization: `Client-ID ${clientId}`,
  };

  const config = {
    headers,
    onUploadProgress,
  };

  return axios
    .post(endpoint, { image: base64ImageContent }, config)
    .then(res => res.data.data.id);
}
