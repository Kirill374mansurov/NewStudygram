class Api {
  constructor(baseUrl, headers) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _getToken() {
    return localStorage.getItem("token");
  }

  _getHeaders(withAuth = false) {
    const token = this._getToken();

    return {
      ...this._headers,
      ...(withAuth && token ? { authorization: `Token ${token}` } : {}),
    };
  }

  _checkResponse(res) {
    if (res.status === 204) {
      return Promise.resolve(null);
    }

    return res.json().then((data) => {
      if (res.ok) {
        return data;
      }
      return Promise.reject(data);
    });
  }

  // auth

  signin({ email, password }) {
    return fetch("/api/auth/token/login/", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(this._checkResponse);
  }

  signout() {
    return fetch("/api/auth/token/logout/", {
      method: "POST",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  signup({ email, password, username, first_name, last_name }) {
    return fetch("/api/users/", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({
        email,
        password,
        username,
        first_name,
        last_name,
      }),
    }).then(this._checkResponse);
  }

  getUserData() {
    return fetch("/api/users/me/", {
      method: "GET",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  getUser({ id }) {
    return fetch(`/api/users/${id}/`, {
      method: "GET",
      headers: this._getHeaders(Boolean(this._getToken())),
    }).then(this._checkResponse);
  }

  changePassword({ current_password, new_password }) {
    return fetch("/api/users/set_password/", {
      method: "POST",
      headers: this._getHeaders(true),
      body: JSON.stringify({ current_password, new_password }),
    }).then(this._checkResponse);
  }

  resetPassword({ email }) {
    return fetch("/api/users/reset_password/", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ email }),
    }).then(this._checkResponse);
  }

  changeAvatar({ file }) {
    return fetch("/api/users/me/avatar/", {
      method: "PUT",
      headers: this._getHeaders(true),
      body: JSON.stringify({ avatar: file }),
    }).then(this._checkResponse);
  }

  deleteAvatar() {
    return fetch("/api/users/me/avatar/", {
      method: "DELETE",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  // topics

  getTopics() {
    return fetch("/api/topics/", {
      method: "GET",
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  // materials

  getMaterials({
    page = 1,
    limit = 6,
    is_favorited = 0,
    author,
    topics,
    search,
  } = {}) {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (author) {
      params.set("author", author);
    }

    if (is_favorited) {
      params.set("is_favorited", is_favorited);
    }

    if (search) {
      params.set("search", search);
    }

    if (topics && Array.isArray(topics)) {
      topics
        .filter((topic) => topic.value)
        .forEach((topic) => {
          params.append("topics", topic.slug);
        });
    }

    return fetch(`/api/materials/?${params.toString()}`, {
      method: "GET",
      headers: this._getHeaders(Boolean(this._getToken())),
    }).then(this._checkResponse);
  }

  getMaterial({ material_id }) {
    return fetch(`/api/materials/${material_id}/`, {
      method: "GET",
      headers: this._getHeaders(Boolean(this._getToken())),
    }).then(this._checkResponse);
  }

  createMaterial({
    title = "",
    description = "",
    content_type = "article",
    link = "",
    topics = [],
    estimated_time = null,
    level = "",
  }) {
    return fetch("/api/materials/", {
      method: "POST",
      headers: this._getHeaders(true),
      body: JSON.stringify({
        title,
        description,
        content_type,
        link: link || null,
        topics,
        estimated_time: estimated_time ? Number(estimated_time) : null,
        level: level || null,
      }),
    }).then(this._checkResponse);
  }

  updateMaterial({
    material_id,
    title,
    description,
    content_type,
    link,
    topics,
    estimated_time,
    level,
  }) {
    return fetch(`/api/materials/${material_id}/`, {
      method: "PATCH",
      headers: this._getHeaders(true),
      body: JSON.stringify({
        title,
        description,
        content_type,
        link: link || null,
        topics,
        estimated_time: estimated_time ? Number(estimated_time) : null,
        level: level || null,
      }),
    }).then(this._checkResponse);
  }

  deleteMaterial({ material_id }) {
    return fetch(`/api/materials/${material_id}/`, {
      method: "DELETE",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  // favorites

  addToFavorites({ id }) {
    return fetch(`/api/materials/${id}/favorite/`, {
      method: "POST",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  removeFromFavorites({ id }) {
    return fetch(`/api/materials/${id}/favorite/`, {
      method: "DELETE",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  // subscriptions

  getSubscriptions({ page = 1, limit = 6, materials_limit = 3 } = {}) {
    return fetch(
      `/api/users/subscriptions/?page=${page}&limit=${limit}&materials_limit=${materials_limit}`,
      {
        method: "GET",
        headers: this._getHeaders(true),
      }
    ).then(this._checkResponse);
  }

  deleteSubscriptions({ author_id }) {
    return fetch(`/api/users/${author_id}/subscribe/`, {
      method: "DELETE",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }

  subscribe({ author_id }) {
    return fetch(`/api/users/${author_id}/subscribe/`, {
      method: "POST",
      headers: this._getHeaders(true),
    }).then(this._checkResponse);
  }
}

export default new Api(process.env.API_URL || "http://localhost", {
  "content-type": "application/json",
});