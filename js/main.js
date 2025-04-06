// API Key და URL-სთვის საჭირო სტრიქონები
export const API_KEY = "9aecc4670a47be5097cd056f9243e661";
export const BASE_URL = "https://api.themoviedb.org/3/movie/popular";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Global Variables
let allMovies = [];
let searchQuery = "";
let currentPage = 1;

// Function to Fetch Movies from API
export async function fetchMovies() {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&page=${currentPage}`);
    const data = await response.json();
    allMovies = data.results;
    displayMovies(allMovies);
}

// Display Movies on the page
function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = "";

    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-image">
            <div class="movie-info">
                <h2>${movie.title}</h2>
                <p class="movie-description">${movie.overview}</p>
                <div class="movie-details">
                    <span class="movie-year">${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
                </div>
                <button class="movie-button" onclick="goToMovieDetails(${movie.id})">See Details</button>
            </div>
        `;

        moviesContainer.appendChild(movieCard);
        movieCard.addEventListener("click", () => {
            goToMovieDetails(movie.id);
        });
    });

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = movies.length < 20;
}

// Filter Movies by search query
document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterMovies();
});

// Filter Movies Based on Search Query
function filterMovies() {
    let filteredMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery)
    );
    displayMovies(filteredMovies);
}

// Handle Pagination for Movies
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

// Handle Movie Detail Redirection
function goToMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

// Functions for Dark Mode Toggle
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

// Apply Dark Mode from LocalStorage
window.onload = () => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark-mode");
    }

    const darkModeButton = document.getElementById("darkModeButton");
    darkModeButton.addEventListener("click", toggleDarkMode);

    // Show Cookie Consent Message if Cookies are not accepted
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
        showCookieMessage();
    }

    fetchMovies(); // Initial API call to fetch movies
};

// Functions for Cookie Consent Message
function showCookieMessage() {
    let cookieMessage = document.getElementById("cookieMessage");
    if (cookieMessage) {
        cookieMessage.style.display = "block";
    }
}

document.getElementById("acceptCookies").addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookieMessage").style.display = "none";
});

// Handle Adding Favorite Movie to SessionStorage and Cookies
function addFavoriteMovie(movieName) {
    console.log("Add movie:", movieName);

    let favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];

    if (!favorites.includes(movieName)) {
        favorites.push(movieName);
        sessionStorage.setItem("favorites", JSON.stringify(favorites));
        setCookie("favorites", favorites.join(","), 30);
    }

    loadFavorites();
}

// Display Favorite Movies from sessionStorage or Cookies
function loadFavorites() {
    let favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
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

// Remove Favorite Movie
function removeFavoriteMovie(movieName) {
    let favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    favorites = favorites.filter((movie) => movie !== movieName);
    sessionStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}

// Set Cookies for Storing Favorite Movies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/" + expires;
}

// Fetch Cookie Data
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
