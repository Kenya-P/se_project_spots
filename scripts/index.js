const initialCards = [
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
];

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardAddButton = document.querySelector(".profile__add-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");


//Form Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileFormElement = editProfileModal.querySelector("#edit-profile");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");
const editProfileNameInput = editProfileModal.querySelector("#name-input");
const editProfileDescriptionElement = editProfileModal.querySelector("#description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardLinkInput = cardModal.querySelector("#card-link-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-button_preview");

//Card elements
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function getCardElement(data) {
console.log(data);

    const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
    
    const cardNameElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button");
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");


    cardImageElement.setAttribute("src", data.link);
    cardImageElement.setAttribute("alt", data.name);
    cardNameElement.textContent = data.name;
    
    cardImageElement.addEventListener("click", () => {
        openModal(previewModal);

        previewModalImageElement.src = data.link;
        previewModalImageElement.alt = data.name;
        previewModalCaptionElement.textContent = data.name;
    });

    cardLikeButton.addEventListener("click", () => {
        cardLikeButton.classList.toggle("card__like-button_liked");
    });

    cardDeleteButton.addEventListener("click", () => {

        const cardDelete = cardDeleteButton.closest(".card");

        cardDelete.remove();
    }); 

    return cardElement;

}


function openModal (modal) {
    modal.classList.add("modal_opened");
}

function closeModal (modal) {
    modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileNameElement.textContent = editProfileNameInput.value;
    profileDescriptionElement.textContent = editProfileDescriptionElement.value;
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
   
    closeModal(cardModal);
    evt.target.reset();
}


profileEditButton.addEventListener("click", () => {
    editProfileNameInput.value = profileNameElement.textContent;
    editProfileDescriptionElement.value = profileDescriptionElement.textContent;
    openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", () => {
    closeModal(editProfileModal);
});

cardAddButton.addEventListener("click", () => {
    openModal(cardModal);
});
cardModalCloseButton.addEventListener("click", () => {
     closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
    closeModal(previewModal);
});


editProfileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);


initialCards.forEach((item) => {
    const cardEl = getCardElement(item);
    cardList.append(cardEl);
});