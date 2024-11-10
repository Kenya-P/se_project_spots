const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-button",
    inactiveButtonClass: "modal__submit-button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error"
  }; 

  const showInputError = (formElement, inputElement, errorMessage, config) => {

    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    errorElement.textContent = errorMessage;

    inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputElement, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

    errorElement.textContent = "";

    inputElement.classList.remove(config.inputErrorClass);
  };

const checkInputValidity = (formElement, inputElement, config) => {
    if (!inputElement.validity.valid) {
      showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        config
    );
    } else {
      hideInputError(formElement, inputElement, config);
    }
  };

const hasInvalidInput = (inputList) => {
   return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement, config) => {
    if (hasInvalidInput(inputList, config)) {
      
      disabledButton(buttonElement, config);
    } else {
        buttonElement.disabled = false;
        
        buttonElement.classList.remove(config.inactiveButtonClass);
    }
};

const disabledButton = (buttonElement) => {
  buttonElement.disabled = true;
//buttonElement.classList.add(config.inactiveButtonClass);
};

const resetValidation = (formElement, inputList, settings) => { 
    inputList.forEach((input) => {
        hideInputError(formElement, input, settings);
    });
};

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, config);
  
    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", function () {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });

    formElement.addEventListener("reset", () => {
      disabledButton(config);
    });
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    })

};

enableValidation(settings);