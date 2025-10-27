import api from './api';

export const uploadPhotos = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('photos', file);
  });

  const response = await api.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const deletePhoto = async (photoId) => {
  const response = await api.delete(`/media/${photoId}`);
  return response.data;
};

export const getPhoto = async (photoId) => {
  const response = await api.get(`/media/${photoId}`);
  return response.data;
};