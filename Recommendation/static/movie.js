const cardContainer = document.querySelector('.card-container');

async function getRandomMovie() {
  try {
    const response = await fetch('/movie');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const results = [];
    for (let i = 0; i < data.result.length; i++) {
      results.push({
        image: data.movie_path[i],
        details: data.result[i]
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; 
  }
}

async function displayCards() {
  try {
    const cardData = await getRandomMovie();

    cardData.forEach(card => {
      const cardElement = createCard(card);
      cardContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error('Error creating cards:', error);
  }
}

function createCard(card) {
  const loaderElement = document.querySelector('.lds-roller');
  if (loaderElement) {
    loaderElement.classList.remove('lds-roller'); 
    loaderElement.classList.add('stopped-loader'); 
  }
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');

  const cardImage = document.createElement('img');
  cardImage.src = card.image;
  cardElement.appendChild(cardImage);

  const cardDetails = document.createElement('div');
  cardDetails.classList.add('card-details');
  cardDetails.textContent = card.details;
  cardElement.appendChild(cardDetails);

  return cardElement;
}

displayCards();
