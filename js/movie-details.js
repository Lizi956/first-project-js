const API_KEY = '9aecc4670a47be5097cd056f9243e661';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function fetchMovieDetails() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('error API');
        }

        const movie = await response.json();
        document.getElementById('movie-details').innerHTML = `
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p>📅 year: ${movie.release_date}</p>
            <a href="index.html" class="back-button">🔙 </a>
        `;
    } catch (error) {
        console.error(' error API:', error);
    }
}

fetchMovieDetails();
