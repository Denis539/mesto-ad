import axios from 'axios';

const config = {
  baseURL: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "c96b156d-060b-4e1f-8851-c68c5a577417",
    "Content-Type": "application/json",
  },
};

const api = axios.create(config);

api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(`Ошибка: ${error.response?.status || error.message}`)
);

export const getUserInfo = () => {
  return api.get('/users/me');
};

export const getCardList = () => {
  return api.get('/cards');
};

export const setUserInfo = ({ name, about }) => {
  return api.patch('/users/me', { name, about });
};

export const setUserAvatar = ({ avatar }) => {
  return api.patch('/users/me/avatar', { avatar });
};

export const addNewCard = ({ name, link }) => {
  return api.post('/cards', { name, link });
};

export const deleteCardFromServer = (cardId) => {
  return api.delete(`/cards/${cardId}`);
};

export const changeLikeCardStatus = (cardId, isLiked) => {
  const method = isLiked ? 'delete' : 'put';
  return api[method](`/cards/likes/${cardId}`);
};
/*
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "c96b156d-060b-4e1f-8851-c68c5a577417",
    "Content-Type": "application/json",
  },
};

const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(getResponseData);
};

export const setUserAvatar = ({ avatar }) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then(getResponseData);
};

export const addNewCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then(getResponseData);
};

export const deleteCardFromServer = ( cardId ) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
};

export const changeLikeCardStatus = (cardID, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
    method: isLiked ?  "DELETE" : "PUT",
    headers: config.headers,
  }).then((res) => getResponseData(res));
};
*/