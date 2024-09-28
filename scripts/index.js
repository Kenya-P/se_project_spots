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
];


const profileEditButton = document.querySelector(".profile__edit-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(".profile__description");



const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileFormElement = editProfileModal.querySelector(".modal__form");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");
const editProfileNameInput = editProfileModal.querySelector("#name-input");
const editProfileDescriptionElement = editProfileModal.querySelector("#description-input");


function openModal () {
    editProfileNameInput.value = profileNameElement.textContent;
    editProfileDescriptionElement.value = profileDescriptionElement.textContent;
    editProfileModal.classList.add("modal__opened");
}

function closeModal () {
    editProfileModal.classList.remove("modal__opened");
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileNameElement.textContent = editProfileNameInput.value;
    profileDescriptionElement.textContent = editProfileDescriptionElement.value;
    closeModal();
}

profileEditButton.addEventListener("click", openModal);
editProfileCloseButton.addEventListener("click", closeModal);
editProfileFormElement.addEventListener("submit", handleProfileFormSubmit);