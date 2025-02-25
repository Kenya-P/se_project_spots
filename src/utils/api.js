class Api {
    constructor({baseUrl, headers}) {
      this._baseUrl = baseUrl;
      this._headers = headers;
    }

    getAppInfo() {
      return Promise.all([
            this.getUserInfo(),  // Fetch user information
            this.getAllCards()   // Fetch all cards
          ]);
      }
      
  
    getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers,
          }).then(this._handleResponse);
    }

    getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: this._headers,
          }).then(this._handleResponse);
    }

    updateUserInfo({name, about}) {
    return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
              name: name,
              about: about
            })
          }).then(this._handleResponse);
    }

    updateUserAvatar(avatarUrl) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify({ avatar: avatarUrl })
      }).then(this._handleResponse);
    }
    

    getAllCards() {
      return fetch(`${this._baseUrl}/cards`, {
        method: "GET",
        headers: this._headers
      }).then(this._handleResponse);  
    }

    createCard({name, link}) {
    return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
              name: name,
              link: link
            })
          }).then(this._handleResponse);
    }

    deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers,
            message: 'This post has been deleted',
          }).then(this._handleResponse);
    }

    updateLikeCard(cardId, isLiked) {// 
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? 'PUT' : 'DELETE',
        headers: this._headers,
      }).then(this._handleResponse);
    }
    

    _handleResponse(res) {
      return res.ok
        ? res.json()
        : res.json().then((err) => Promise.reject(`Error ${res.status}: ${err.message || err}`));
    }
      
}
  
export default Api;