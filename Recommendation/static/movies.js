const cardContainer = document.querySelector('.card-container');

async function random() {
fetch('/movie')
  .then(response => response.json())
  .then(data => {
    const results = [];
    for (let i = 0; i < data.result.length; i++) {
      results.push({
        image: data.movie_path[i],
        details: data.result[i]
      });
    }

    console.log(results);
    return results;
  })
}
const cardData=random().then(data => {
  console.log(data);})
console.log(cardData)
function createCard(card) {
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

// Dynamically add cards to the container
cardData.forEach(card => {
  cardContainer.appendChild(createCard(card));
});
