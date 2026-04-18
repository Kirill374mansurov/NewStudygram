const BASE_URL = '/api';

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
    };
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return res.json().then((err) => Promise.reject(err));
  }

  getTopics() {
    return fetch(`${this._baseUrl}/topics/`, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  getMaterials(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `${this._baseUrl}/materials/?${query}`
      : `${this._baseUrl}/materials/`;

    return fetch(url, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  getMaterial(id) {
    return fetch(`${this._baseUrl}/materials/${id}/`, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  createMaterial(data) {
    return fetch(`${this._baseUrl}/materials/`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  updateMaterial(id, data) {
    return fetch(`${this._baseUrl}/materials/${id}/`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  deleteMaterial(id) {
    return fetch(`${this._baseUrl}/materials/${id}/`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then((res) => {
      if (res.ok) return null;
      return res.json().then((err) => Promise.reject(err));
    });
  }

  addFavorite(id) {
    return fetch(`${this._baseUrl}/materials/${id}/favorite/`, {
      method: 'POST',
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  removeFavorite(id) {
    return fetch(`${this._baseUrl}/materials/${id}/favorite/`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then((res) => {
      if (res.ok) return null;
      return res.json().then((err) => Promise.reject(err));
    });
  }

  getSubscriptions() {
    return fetch(`${this._baseUrl}/users/subscriptions/`, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  subscribe(userId) {
    return fetch(`${this._baseUrl}/users/${userId}/subscribe/`, {
      method: 'POST',
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  unsubscribe(userId) {
    return fetch(`${this._baseUrl}/users/${userId}/subscribe/`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then((res) => {
      if (res.ok) return null;
      return res.json().then((err) => Promise.reject(err));
    });
  }
}

const api = new Api({
  baseUrl: BASE_URL,
});

export default api;