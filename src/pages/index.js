import { enableValidation, settings, resetValidation} from "../scripts/validation.js";
import "./index.css";
import spotsLogoSrc from "../images/logo.svg";
import spotsAvatarSrc from "../images/avatar.jpg";
import spotsPencilSrc from "../images/pencil.svg";
import spotsAddSrc from "../images/add.svg";
import Api from "../utils/api.js";
import { setButtonText } from "../utils/helpers.js";

const spotsLogo = document.getElementById("spots-logo");
if (spotsLogo) spotsLogo.src = spotsLogoSrc;

const spotsPencil = document.getElementById("spots-pencil");
if (spotsPencil) spotsPencil.src = spotsPencilSrc;

const spotsAdd = document.getElementById("spots-add");
if (spotsAdd) spotsAdd.src = spotsAddSrc;


const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "ea7006fd-eee9-4b90-adca-27b6c65eefb9",
      "Content-Type": "application/json"
    }
  });


//Profile Elements
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");
const spotsAvatar = document.getElementById("spots-avatar");
if (spotsAvatar) spotsAvatar.src = spotsAvatarSrc;

api.getAppInfo()
    .then(([userData, cards]) => {
        profileNameElement.textContent = userData.name;
        profileDescriptionElement.textContent = userData.about;
        spotsAvatar.src = userData.avatar;
        cardCaptionInput.value = "";
        cardLinkInput.value = "";
    
        cards.forEach((item) => {
              const cardEl = getCardElement(item);
              cardList.append(cardEl);
      });
}).catch(console.error);

const cardList = document.querySelector(".cards__list");

const cardTemplate = document.querySelector("#card-template");
  
//Modal Elements
const modalElements = document.querySelectorAll(".modal");


//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardAddButton = document.querySelector(".profile__add-button");


//Profile Form Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileFormElement = editProfileModal.querySelector("#edit-profile");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");
const editProfileNameInput = editProfileModal.querySelector("#name-input");
const editProfileDescriptionElement = editProfileModal.querySelector("#description-input");
const avatarModalButton = document.querySelector(".profile__avatar-button");


//Card Form Elements
const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardLinkInput = cardModal.querySelector("#card-link-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-button_preview");

//Avatar Form Elements
const avatarModal = document.getElementById("avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");


//Delete Card Elements
const cardDeleteModal = document.querySelector("#delete-modal");
const cardDeleteForm = cardDeleteModal.querySelector(".modal__form");


let selectedCard, selectedCardId;


function getCardElement(data) {
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    
    const cardNameElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button");
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");

    if (data.isLiked) {
      cardLikeButton.classList.add("card__like-button_liked");
    } else {
      cardLikeButton.classList.remove("card__like-button_liked");
    }
  
    cardImageElement.setAttribute("src", data.link);
    cardImageElement.setAttribute("alt", data.name);
    cardNameElement.textContent = data.name;
    
    cardImageElement.addEventListener("click", () => {
        openModal(previewModal);

        previewModalImageElement.src = data.link;
        previewModalImageElement.alt = data.name;
        previewModalCaptionElement.textContent = data.name;
    });

    cardLikeButton.addEventListener("click", (evt) => {
      handleLikeCard(evt, data._id, data.isLiked);
      data.isLiked = !data.isLiked;
    });
    
    cardDeleteButton.addEventListener("click", () => handleDeleteCard(cardElement, data._id));

    return cardElement;

}


function openModal (modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscape);
}

function closeModal (modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscape);
}

function handleLikeCard(evt, cardId, isLiked) {
  const likeButton = evt.target;
  const newLikeState = !isLiked;

  api.updateLikeCard(cardId, newLikeState)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button_liked");
      } else {
        likeButton.classList.remove("card__like-button_liked");
      }
    })
    .catch(console.error);
}


function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const submitButton = evt.submitter;
    setButtonText(submitButton, true, "Saving...", "Save");

    api.updateUserInfo({name: editProfileNameInput.value, about: editProfileDescriptionElement.value})
    .then((userData) => {
        profileNameElement.textContent = userData.name;
        profileDescriptionElement.textContent = userData.about;
        closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Saving...", "Save");
    });

}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const cardSubmitButton = evt.submitter;
  cardSubmitButton.disabled = true;
  setButtonText(cardSubmitButton, true, "Saving...");

  const inputValue = { 
      name: cardCaptionInput.value, 
      link: cardLinkInput.value
  };

  api.createCard(inputValue)
      .then((newCard) => {
          const cardEl = getCardElement(newCard);
          cardList.prepend(cardEl);
          cardCaptionInput.value = "";
          cardLinkInput.value = "";
          closeModal(cardModal);
          cardFormElement.reset();
      })
      .catch((err) => {
        console.error(err);
        cardSubmitButton.disabled = false;
      })
      .finally(() => {
        setButtonText(cardSubmitButton, false, "saving...", "Save");
      });
}

document.getElementById("edit-avatar-form").addEventListener("submit", handleAvatarFormSubmit);


function handleAvatarFormSubmit(evt) {
    evt.preventDefault();

    const avatarSubmitButton = evt.submitter;
    setButtonText(avatarSubmitButton, true);
    avatarSubmitButton.disabled = true;

    api.updateUserAvatar(avatarLinkInput.value)
    .then((userData) => {
        spotsAvatar.src = userData.avatar;
        closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
        avatarSubmitButton.disabled = false;
        setButtonText(avatarSubmitButton, false);
    });
}


function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Deleting...");


  api.deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(cardDeleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Deleting...", "Delete");
    });

  }

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;


  openModal(cardDeleteModal);

  const cancelButton = cardDeleteModal.querySelector(".modal__cancel-button");

  cancelButton.addEventListener("click", () => {
      closeModal(cardDeleteModal);
  });

}

profileEditButton.addEventListener("click", () => {
    editProfileNameInput.value = profileNameElement.textContent;
    editProfileDescriptionElement.value = profileDescriptionElement.textContent;
    resetValidation(
        editProfileFormElement,
        [editProfileNameInput, editProfileDescriptionElement],
        settings,
      );
    openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll('.modal__close-button');

closeButtons.forEach((button) => {
  const popup = button.closest('.modal');
  button.addEventListener('click', () => closeModal(popup));
});

cardAddButton.addEventListener("click", () => {
    openModal(cardModal);
});

function handleEscape(evt) {
    if (evt.key === "Escape") {
        const openedPopUp = document.querySelector(".modal_opened");
        closeModal(openedPopUp);
    }
  };

  avatarModalButton.addEventListener("click", () => {
    openModal(avatarModal);
});

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
cardDeleteForm.addEventListener("submit", handleDeleteSubmit);

  modalElements.forEach(modal => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target.classList.contains("modal")) {
        closeModal(modal);
      }
    });
  });


editProfileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);




enableValidation(settings);
