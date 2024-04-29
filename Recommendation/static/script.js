async function performSearchAndDisplayCards() {
  console.log("njdv")
  const contentElement = document.getElementById('my-content');
  contentElement.style.display = 'inline-block';
  const searchBar = document.getElementById('search-bar');
  const searchText = searchBar.value;

  console.log(`Search term: ${searchText}`);
  searchBar.value = '';

  try {
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchText
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    const cardContainer = document.querySelector('.card-container');

    const results = [];
    for (let i = 0; i < data.result.length; i++) {
      results.push({
        image: data.movie_path[i],
        details: data.result[i]
      });
    }

    results.forEach(card => {
      const cardElement = createCard(card);
      cardContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

searchBtn.addEventListener('click', performSearchAndDisplayCards);

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
