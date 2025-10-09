import api from './api';

const register = (username, email, password) => {
  return api.post('/auth/register', {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return api.post('/auth/login', {
    email,
    password,
  });
};

export default {
  register,
  login,
};
