const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfo, userId }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCount = cardElement.querySelector(".card__like-count");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  

  if (data.owner._id !== userId) {
    deleteButton.remove();
  }

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  const isLikedByMe = data.likes.some((like) => { return like._id === userId });
  if (isLikedByMe) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeCount.textContent = data.likes.length;

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      onLikeIcon(data._id, likeButton.classList.contains("card__like-button_is-active"))
        .then((newCardData) => {
          likeCard(likeButton);
          likeCount.textContent = newCardData.likes.length;
        })
    })
  }

  if (onDeleteCard && deleteButton) {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(data._id)
        .then(() => {
          deleteCard(cardElement);
        })
    })
  }

  if (onInfo) {
    infoButton.addEventListener("click", () => {
      onInfo(data._id);
    })
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};