const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const searchInput = document.getElementById('searchInput');
const resultContainer = document.getElementById('resultContainer');

function displayResults(places) {
  resultContainer.innerHTML = '';
  if (!places || places.length === 0) {
    resultContainer.innerHTML = '<p style="color:#fff;background:#1e293b;padding:1rem;border-radius:6px;">No results found.</p>';
    return;
  }

  places.forEach(place => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <div class="result-card-body">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
      </div>
    `;
    resultContainer.appendChild(card);
  });
}

function searchPlaces() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let results = [];

      if (query === 'beach' || query === 'beaches') {
        results = data.beaches;
      } else if (query === 'temple' || query === 'temples') {
        results = data.temples;
      } else if (query === 'country' || query === 'countries') {
        // Collect first cities from each country
        data.countries.forEach(c => results.push(...c.cities));
      } else {
        // Search specific country name
        const foundCountry = data.countries.find(c => c.name.toLowerCase() === query);
        if (foundCountry) {
          results = foundCountry.cities;
        }
      }

      displayResults(results);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    });
}

function clearResults() {
  searchInput.value = '';
  resultContainer.innerHTML = '';
}

btnSearch.addEventListener('click', searchPlaces);
btnClear.addEventListener('click', clearResults);
