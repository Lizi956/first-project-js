import { allMovies } from "./main.js";
import { filterMovies } from "./main.js";
import { BASE_URL } from "./main.js";
import { API_KEY } from "./main.js";
import { currentPage } from "./main.js";

export async function fetchMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}?api_key=${API_KEY}&page=${currentPage}`
    );
    if (!response.ok) {
      throw new Error("Error fetching movies.");
    }

    const data = await response.json();
    allMovies.data = data.results;
    filterMovies();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}
