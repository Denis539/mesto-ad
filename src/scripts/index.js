/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, getCardList, setUserInfo, setUserAvatar, addNewCard, deleteCardFromServer, changeLikeCardStatus } from "./components/api.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileFormButton = profileForm.querySelector(".popup__button");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardFormButton = cardForm.querySelector(".popup__button");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const avatarFormButton = avatarForm.querySelector(".popup__button");

let userInfo;

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalText = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalLikesList = cardInfoModalWindow.querySelector(".popup__list");

const cardInfoListElement = document.querySelector("#popup-info-definition-template");
const cardInfoLikesListElement = document.querySelector("#popup-info-user-preview-template");

const createInfoString = (term, description) => {
  const infoElement = cardInfoListElement.content.cloneNode(true);
  const infoElementTerm = infoElement.querySelector(".popup__info-term");
  const infoElementDescription = infoElement.querySelector(".popup__info-description");
  infoElementTerm.textContent = term;
  infoElementDescription.textContent = description;
  return infoElement;
};

const createLikeInfoString = (item) => {
  const infoElement = cardInfoLikesListElement.content.cloneNode(true);
  const infoElementItem = infoElement.querySelector(".popup__list-item");
  infoElementItem.textContent = item;
  return infoElement;
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
const handleInfoClick = (cardId) => {
  /* Для вывода корректной информации необходимо получить актуальные данные с сервера. */
  getCardList()
    .then((cards) => {
       // Другая логика наполнения модального окна данными
      let cardData;
      cards.forEach((card) => {
        if (card._id === cardId){
          cardData = card;
        }
      });

      cardInfoModalTitle.textContent = "Информация о карточке";
      cardInfoModalText.textContent = "Лайкнули:";
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalLikesList.innerHTML = "";

      cardInfoModalInfoList.append(
        createInfoString(
          "Описание:",
          cardData.name
        )
      );
      cardInfoModalInfoList.append(
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardData.createdAt))
        )
      );
      cardInfoModalInfoList.append(
        createInfoString(
          "Владелец:",
          cardData.owner.name
        )
      );
      cardInfoModalInfoList.append(
        createInfoString(
          "Количество лайков:",
          cardData.likes.length
        )
      );

      cardData.likes.forEach((like) => {
        cardInfoModalLikesList.append(createLikeInfoString(like.name));
      });
    
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};


const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};


const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileFormButton.textContent = "Сохранение...";
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      profileFormButton.textContent = "Сохранить";
    });
};


const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  avatarFormButton.textContent = "Сохранение...";
  setUserAvatar({
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      avatarFormButton.textContent = "Сохранить";
    });
};


const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  cardFormButton.textContent = "Создание...";
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: changeLikeCardStatus,
            onDeleteCard: deleteCardFromServer,
            onInfo: handleInfoClick,
            userId: userInfo._id,
          }
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      cardFormButton.textContent = "Создать";
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings);


Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    cards.forEach((data) => {
      placesWrap.append(
        createCardElement(data, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: changeLikeCardStatus,
          onDeleteCard: deleteCardFromServer,
          onInfo: handleInfoClick,
          userId: userData._id,
        })
      );
    }); // Код отвечающий за отрисовку полученных данных
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    userInfo = userData;
  })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });