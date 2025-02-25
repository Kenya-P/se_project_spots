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

//Card Data

/*const initialCards = [
    {
        name:"Val Thorens", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
    },
    {
        name:"Restaurant terrace", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
    },
    {
        name:"An outdoor cafe", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
    },
    {
        name:"A very long bridge, over the forest and through the trees", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
    },
    {
        name:"Tunnel with morning light", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
    },
    {
        name:"Mountain house", 
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
    },
    {
        name:"Golden Gate Bridge",
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
    },
];*/

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
    .then(([userData]) => {
        profileNameElement.textContent = userData.name;
        profileDescriptionElement.textContent = userData.about;
        spotsAvatar.src = userData.avatar;
    
}).catch(console.error);


api.updateUserAvatar("https://images.unsplash.com/vector-1738590591814-bd8941342c96?q=80&w=1760&auto=format&fit=crop")
  .then((updatedUser) => {
    spotsAvatar.src = updatedUser.avatar;
  })
  .catch(console.error);

const cardList = document.querySelector(".cards__list");

  api.getAllCards()
  .then((cards) => {
      cards.forEach((item) => {
          if (!document.querySelector(`[data-card-id="${item._id}"]`)) {
              const cardEl = getCardElement(item);
              cardList.append(cardEl);
          }
      });
      console.log("Cards fetched:", cards);
  })
  .catch(console.error);


const cardTemplate = document.querySelector("#card-template");

/* api.createCard({
  name: cardCaptionInput.value, 
  link: cardLinkInput.value

    }).then((newCard) => {

    const existingCard = document.querySelector(`[data-card-id="${newCard._id}"]`);
        if (!existingCard) {
    
    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    const cardEl = getCardElement(newCard);
    cardList.prepend(cardEl);
    //console.log("Card created successfully:", newCard);
        } else {
            console.warn("Duplicate card detected. Skipping creation.");
        }
}).catch(console.error); */

document.getElementById("add-card-modal").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("card-caption-input").value;
  const link = document.getElementById("card-link-input").value;

  if (!name || !link) {
    console.warn("Both fields are required!");
    return;
  }

  api.createCard({ name, link })
    .then((newCard) => {
      const existingCard = document.querySelector(`[data-card-id="${newCard._id}"]`);
      if (!existingCard) {
        const cardEl = getCardElement(newCard);
        cardList.prepend(cardEl);
        console.log("Card created successfully:", newCard);
      } else {
        console.warn("Duplicate card detected. Skipping creation.");
      }

      // Clear form and close modal (if you have one)
      document.getElementById("add-card-form").reset();
      closeModal(); // Assuming you have a function to close the modal
    })
    .catch(console.error);
});

const cardElement = document.querySelector("[data-card-id]");
if (cardElement) {
  const cardId = cardElement.getAttribute("data-card-id");
  
  if (cardId) {
    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch(console.error);

    api.handleLikeCard(cardId)
      .then((updatedCard) => {
        cardLikeButton.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  }
} else {
  console.warn("No card found with [data-card-id]");
}


const formElement = document.querySelector(".popup__form");

if (formElement) {
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
  
    if (!formElement.checkValidity()) {
      console.log("Form is invalid!");
      return;
    }
  
    const cardId = formElement.getAttribute("data-card-id");
    const updatedCard = {
      name: formElement.querySelector(".popup__input_type_name").value,
      link: formElement.querySelector(".popup__input_type_url").value
    };
  
    api.updateCard(cardId, updatedCard)
      .then((updatedCard) => {
        console.log("Card updated successfully:", updatedCard);
      })
      .catch(console.error);
  });
}
  


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
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");

//Delete Card Elements
const cardDeleteModal = document.querySelector("#delete-modal");
const cardDeleteForm = cardDeleteModal.querySelector(".modal__form");


//let selectedCard, selectedCardId;


function getCardElement(data) {
//console.log(data);

    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    
    cardElement.setAttribute("data-card-id", data._id);

    const cardNameElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button");
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");

    if (Array.isArray(data.likes) && data.likes.some((like) => like._id === data._id)) {
      cardLikeButton.classList.add("card__like-button_liked");
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

    cardLikeButton.addEventListener("click", (evt) => handleLikeCard(evt, data._id, cardLikeButton));

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

function handleLikeCard(evt, cardId) {
    const isLiked = evt.target.classList.contains("card__like-button_liked");
    //const updateLikeCard = isLiked ? api.unlikeCard(cardId) : api.likeCard(cardId);

    api.updateLikeCard(cardId, isLiked)
        .then((updatedCard) => {
            evt.target.classList.toggle("card__like-button_liked");

            const likeCounter = evt.target.nextElementSibling;
            if (likeCounter) {
                likeCounter.textContent = updatedCard.likes.length;
            }
        })
        .catch(console.error);
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const submitButton = evt.submitter;
    setButtonText(submitButton, true, "Saving...");

    api.updateUserInfo({name: editProfileNameInput.value, about: editProfileDescriptionElement.value})
    .then((userData) => {
        profileNameElement.textContent = userData.name;
        profileDescriptionElement.textContent = userData.about;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, true, "Saving...", "Save");
    });

    //profileNameElement.textContent = editProfileNameInput.value;
    //profileDescriptionElement.textContent = editProfileDescriptionElement.value;
    closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const inputValue = { 
        name: cardCaptionInput.value, 
        link: cardLinkInput.value
    };

    const cardEl = getCardElement(inputValue);

    cardList.prepend(cardEl);
    evt.target.reset();

    disableButton(cardSubmitButton, settings);
    closeModal(cardModal);
}

function handleAvatarFormSubmit(evt) {
    evt.preventDefault();

    api.updateUserAvatar(avatarLinkInput.value)
    .then((userData) => {
        spotsAvatar.src = userData.avatar;
    })
    .catch(console.error)
    .finally(() => {
        setButtonText(avatarSubmitButton, false, "Save", "Saving...");
    });
}


// Global variables for selected card
let selectedCard = null;
let selectedCardId = null;

function handleDeleteSubmit(evt) {
    evt.preventDefault();
    if (!selectedCardId || !selectedCard) {
        console.error("No card selected for deletion");
        return;
    }

    setButtonText(cardDeleteForm, true, "Yes", "Deleting...");

    api.deleteCard(selectedCardId)
        .then(() => {
            selectedCard.remove();
            closeModal(cardDeleteModal);
            console.log("Card deleted successfully");
        })
        .catch(err => {
            console.error("Failed to delete card:", err);
        })
        .finally(() => {
            setButtonText(cardDeleteForm, false, "Yes", "Deleting...");
            selectedCard = null;
            selectedCardId = null;
        });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;

  const cardDeleteModal = document.getElementById('delete-modal');
  if (!cardDeleteModal) {
    console.error("Delete modal not found!");
    return;
  }

  openModal(cardDeleteModal);

  // Re-select the buttons each time the modal opens
  const confirmButton = cardDeleteModal.querySelector(".modal__delete-button");
  const cancelButton = cardDeleteModal.querySelector(".modal__cancel-button");

  console.log(confirmButton, cancelButton); // Debug log

  if (!confirmButton || !cancelButton) {
    console.error("Delete or Cancel button not found!");
    return;
  }

  // Remove any previous event listeners by replacing the buttons
  confirmButton.replaceWith(confirmButton.cloneNode(true));
  cancelButton.replaceWith(cancelButton.cloneNode(true));

  const newConfirmButton = cardDeleteModal.querySelector(".modal__delete-button");
  const newCancelButton = cardDeleteModal.querySelector(".modal__cancel-button");

  newConfirmButton.addEventListener("click", function handleConfirmDelete() {
    console.log("Deleting...");

    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closeModal(cardDeleteModal);
        console.log("Card deleted successfully");
      })
      .catch((err) => {
        console.error("Failed to delete card:", err);
      })
      .finally(() => {
        setButtonText(cardDeleteForm, false, "Yes", "Deleting...");
      });
  });

  newCancelButton.addEventListener("click", () => {
    closeModal(cardDeleteModal);
    console.log("Delete cancelled");
  });

  console.log("Modal opened", cardDeleteModal);
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
