const API_KEY = "9aecc4670a47be5097cd056f9243e661";
const BASE_URL = "https://api.themoviedb.org/3/movie/popular";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

let allMovies = [];
let searchQuery = "";
let currentPage = 1;
async function fetchMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}?api_key=${API_KEY}&page=${currentPage}`
    );

    if (!response.ok) {
      throw new Error("error API ");
    }

    const data = await response.json();
    allMovies = data.results;
    displayMovies(allMovies);
  } catch (error) {
    console.error(" error API:", error);
  }
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
                      movie.release_date
                        ? movie.release_date.split("-")[0]
                        : "N/A"
                    }</span>
                </div>
                <button class="movie-button" onclick="goToMovieDetails(${
                  movie.id
                })">see</button>
            </div>
        `;

    moviesContainer.appendChild(movieCard);
  });

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = movies.length < 20;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  filterMovies();
});

document.getElementById("filter").addEventListener("change", filterMovies);
function filterMovies() {
  let filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery)
  );
}

function filterMovies() {
  let filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery)
  );
  displayMovies(filteredMovies);
}

async function fetchMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}?api_key=${API_KEY}&page=${currentPage}`
    );
    if (!response.ok) {
      throw new Error("Error fetching movies.");
    }

    const data = await response.json();
    allMovies = data.results;
    filterMovies();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
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

function newFunction() {
  displayMovies(filterMovies);
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies();
    }
  });
}

function goToMovieDetails(movieId) {
  window.location.href = `movie-details.html?id=${movieId}`;
}

fetchMovies();
document.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }

  document.getElementById("toggleDarkMode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const newMode = document.body.classList.contains("dark-mode")
      ? "enabled"
      : "disabled";
    localStorage.setItem("darkMode", newMode);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

cart.forEach((item) => {
  let li = document.createElement("li");
  li.textContent = item;
  cartItemsContainer.appendChild(li);
});

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
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function addFavoriteMovie(movieName) {
  console.log("add movie:", movieName);

  let favorites = getCookie("favorites");
  favorites = favorites ? favorites.split(",") : [];

  if (!favorites.includes(movieName)) {
    favorites.push(movieName);
    setCookie("favorites", favorites.join(","), 30);
  }

  loadFavorites();
}

function loadFavorites() {
  console.log("favorite movie install...");
  let favorites = getCookie("favorites");
  favorites = favorites ? favorites.split(",") : [];

  let list = document.getElementById("favoritesList");
  list.innerHTML = "";

  favorites.forEach((movie) => {
    let li = document.createElement("li");
    li.textContent = movie;
    list.appendChild(li);
  });
}

function showCookieMessage() {
  let cookieMessage = document.getElementById("cookieMessage");
  cookieMessage.style.display = "block";
}

function acceptCookies() {
  setCookie("cookiesAccepted", "true", 30);
  document.getElementById("cookieMessage").style.display = "none";
}

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
    removeBtn.textContent = "delete";
    removeBtn.onclick = function () {
      removeFavoriteMovie(movie);
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function addFavoriteMovie(movieName) {
  let favorites = getCookie("favorites");
  favorites = favorites ? favorites.split(",") : [];

  if (!favorites.includes(movieName)) {
    favorites.push(movieName);
    setCookie("favorites", favorites.join(","), 30);
    loadFavorites();
  }
}

function removeFavoriteMovie(movieName) {
  let favorites = getCookie("favorites");
  favorites = favorites ? favorites.split(",") : [];
  favorites = favorites.filter((movie) => movie !== movieName);
  setCookie("favorites", favorites.join(","), 30);
  loadFavorites();
}
function addFavoriteMovie(movieName) {
  let favorites = sessionStorage.getItem("favorites");

  if (favorites) {
    favorites = JSON.parse(favorites);
  } else {
    favorites = [];
  }

  if (!favorites.includes(movieName)) {
    favorites.push(movieName);
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
  }

  loadFavorites();
}

function loadFavorites() {
  let favorites = sessionStorage.getItem("favorites");

  if (favorites) {
    favorites = JSON.parse(favorites);
  } else {
    favorites = [];
  }

  let list = document.getElementById("favoritesList");
  list.innerHTML = "";

  favorites.forEach((movie) => {
    let li = document.createElement("li");
    li.textContent = movie;

    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "წაშლა";
    removeBtn.onclick = function () {
      removeFavoriteMovie(movie);
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function removeFavoriteMovie(movieName) {
  let favorites = sessionStorage.getItem("favorites");

  if (favorites) {
    favorites = JSON.parse(favorites);
  } else {
    favorites = [];
  }

  favorites = favorites.filter((movie) => movie !== movieName);
  sessionStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavorites();
}
fetchMovies();
