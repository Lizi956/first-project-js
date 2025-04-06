export const API_KEY = "9aecc4670a47be5097cd056f9243e661";
export const BASE_URL = "https://api.themoviedb.org/3/movie/popular";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

export let allMovies = [];
export let currentPage = 1;
let searchQuery = "";

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

  const button = document.getElementById("darkModeButton");
  button.textContent = isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode";
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${
      movie.title
    }" class="movie-image">
      <div class="movie-info">
        <h2>${movie.title}</h2>
        <p class="movie-description">${movie.overview}</p>
        <div class="movie-details">
          <span class="movie-year">${
            movie.release_date ? movie.release_date.split("-")[0] : "N/A"
          }</span>
        </div>
        <button onclick="addFavoriteMovie('${
          movie.title
        }')" class="movie-button">Add to Favorites</button>
        <button onclick="goToMovieDetails(${
          movie.id
        })" class="movie-button">See Details</button>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = movies.length < 20;
}

window.addFavoriteMovie = function (movieName) {
  let sessionFavorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
  if (!sessionFavorites.includes(movieName)) {
    sessionFavorites.push(movieName);
    sessionStorage.setItem("favorites", JSON.stringify(sessionFavorites));
  }

  let cookieFavorites = getCookie("favorites");
  cookieFavorites = cookieFavorites ? cookieFavorites.split(",") : [];

  if (!cookieFavorites.includes(movieName)) {
    cookieFavorites.push(movieName);
    setCookie("favorites", cookieFavorites.join(","), 30);
  }

  loadFavorites();
};

window.removeFavoriteMovie = function (movieName) {
  let sessionFavorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
  sessionFavorites = sessionFavorites.filter((movie) => movie !== movieName);
  sessionStorage.setItem("favorites", JSON.stringify(sessionFavorites));

  let cookieFavorites = getCookie("favorites");
  cookieFavorites = cookieFavorites ? cookieFavorites.split(",") : [];
  cookieFavorites = cookieFavorites.filter((movie) => movie !== movieName);
  setCookie("favorites", cookieFavorites.join(","), 30);

  loadFavorites();
};

function loadFavorites() {
  let favorites = getCookie("favorites");
  favorites = favorites ? favorites.split(",") : [];

  let list = document.getElementById("favoritesList");
  list.innerHTML = "";

  favorites.forEach((movie) => {
    let li = document.createElement("li");
    li.textContent = movie;

    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Delete";
    removeBtn.onclick = function () {
      removeFavoriteMovie(movie);
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function showCookieMessage() {
  let cookieMessage = document.getElementById("cookieMessage");

  if (cookieMessage) {
    cookieMessage.style.display = "block";
  }
}

function acceptCookies() {
  setCookie("cookiesAccepted", "true", 30);
  let cookieMessage = document.getElementById("cookieMessage");
  if (cookieMessage) {
    cookieMessage.style.display = "none";
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + "; path=/" + expires;
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) == 0)
      return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

window.goToMovieDetails = function (movieId) {
  window.location.href = `movie-details.html?id=${movieId}`;
};

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  filterMovies();
});

document.getElementById("filter").addEventListener("change", filterMovies);

export function filterMovies() {
  let filteredMovies = allMovies.data.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery)
  );
  displayMovies(filteredMovies);
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  fetchMovies();
});

function fetchMovies() {
  const url = `${BASE_URL}?api_key=${API_KEY}&page=${currentPage}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      allMovies = data.results;
      displayMovies(allMovies);
    });
}

window.onload = function () {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeButton").textContent = "🌞 Light Mode";
  } else {
    document.getElementById("darkModeButton").textContent = "🌙 Dark Mode";
  }

  document
    .getElementById("darkModeButton")
    .addEventListener("click", toggleDarkMode);

  loadFavorites();
  const cookiesAccepted = getCookie("cookiesAccepted");
  if (!cookiesAccepted) {
    showCookieMessage();
  }

  fetchMovies();
};
