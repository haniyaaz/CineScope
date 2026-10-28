const API_KEY = "9fb46d78ad94ec2cd11092d27c3ee7a2";
const API_URL = "https://api.themoviedb.org/3";
let allMovies = [];

let currentSearchPage = 1;
let totalSearchPages = 1;
let currentSearchQuery = "";


async function fetchPopularMovies() {
    try {
        const response = await fetch(
            `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        
const genreNames = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    18: "Drama",
    14: "Fantasy",
    27: "Horror",
    10749: "Romance",
    878: "Science Fiction",
    53: "Thriller"
};

allMovies = data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date
        ? movie.release_date.slice(0, 4)
        : "N/A",
    rating: movie.vote_average,
    genre: movie.genre_ids
        .map(id => genreNames[id])
        .filter(Boolean)
        .join(", ") || "Other",
    description: movie.overview || "No description available.",
    poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/400x600?text=No+Poster"
}));

renderMovies(allMovies, movieGrid);
movieCount.textContent = `${allMovies.length} movies found`;

// Restore saved watchlist after TMDB movies load
updateFavorites();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

const movies = [
    {
        id: 1,
        title: "Interstellar",
        year: 2014,
        rating: 8.7,
        genre: "Sci-Fi",
        description: "A team travels beyond this galaxy to discover whether mankind has a future among the stars.",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
        id: 2,
        title: "Inception",
        year: 2010,
        rating: 8.8,
        genre: "Thriller",
        description: "A skilled thief enters people's dreams to steal secrets and attempts an almost impossible mission.",
        poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
    },
    {
        id: 3,
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        genre: "Action",
        description: "Batman faces a criminal mastermind who throws Gotham City into chaos.",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
        id: 4,
        title: "Dune: Part Two",
        year: 2024,
        rating: 8.5,
        genre: "Adventure",
        description: "Paul Atreides joins the Fremen while seeking justice and confronting his destiny.",
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
    },
    {
        id: 6,
        title: "The Avengers",
        year: 2012,
        rating: 8.0,
        genre: "Action",
        description: "Earth's mightiest heroes unite to defend the world from a dangerous threat.",
        poster: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
    },
    {
        id: 7,
        title: "Spider-Man: No Way Home",
        year: 2021,
        rating: 8.2,
        genre: "Action",
        description: "Peter Parker's world changes when a spell brings unexpected visitors into his life.",
        poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
    },
    {
        id: 8,
        title: "Coco",
        year: 2017,
        rating: 8.4,
        genre: "Animation",
        description: "A young musician discovers his family's history during an unforgettable adventure.",
        poster: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg"
    }
];

const movieGrid = document.getElementById("movie-grid");
const loadMoreButton = document.getElementById("load-more-btn");
const favoritesGrid = document.getElementById("favorites-grid");
const genreFilter = document.getElementById("genre-filter");
const sortBy = document.getElementById("sort-by");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const movieCount = document.getElementById("movie-count");
const movieModal = document.getElementById("movie-modal");
const modalClose = document.getElementById("modal-close");
const modalPoster = document.getElementById("modal-poster");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalDescription = document.getElementById("modal-description");
const modalRating = document.getElementById("modal-rating");
const trailerButton = document.getElementById("trailer-button");
const trailerContainer = document.getElementById("trailer-container");
const trailerPlayer = document.getElementById("trailer-player");


// Load saved favorites from the browser.
let favorites = JSON.parse(localStorage.getItem("cinescope-favorites")) || [];

function renderMovies(movieList, container, showDescription = false) {
    if (movieList.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No movies found. Try another search!
            </p>
        `;
        return;
    }

    container.innerHTML = movieList.map(movie => {
        const isFavorite = favorites.includes(movie.id);

        return `
            <article class="movie-card">
                <img
                class="movie-poster"
                src="${movie.poster}"
                alt="${movie.title} movie poster"
                loading="lazy"
                onerror="this.onerror=null; this.src='https://placehold.co/400x600/111a2b/f4f7ff?text=Poster+Unavailable';"
                >


                <div class="movie-info">
                    <div class="movie-title-row">
                        <h3 class="movie-title">${movie.title}</h3>
                        <span class="movie-rating">★ ${movie.rating}</span>
                    </div>

                    <p class="movie-year">
                        ${movie.year} · ${movie.genre}
                    </p>

                    ${showDescription ? `
                        <p class="movie-year">${movie.description}</p>
                    ` : ""}

                    <button
                        class="favorite-btn ${isFavorite ? "saved" : ""}"
                        data-movie-id="${movie.id}"
                    >
                        ${isFavorite ? "♥ In Watchlist" : "♡ Add to Watchlist"}
                    </button>
                </div>
            </article>
        `;
    }).join("");
}



function updateFavorites() {
    localStorage.setItem(
        "cinescope-favorites",
        JSON.stringify(favorites)
    );

    const favoriteMovies = allMovies.filter(movie =>
        favorites.includes(Number(movie.id))
    );

    renderMovies(favoriteMovies, favoritesGrid, true);
}




function searchMovies(query = "") {
    const searchTerm = query.toLowerCase().trim();
    const selectedGenre = genreFilter.value;
    const selectedSort = sortBy.value;

    let filteredMovies = allMovies.filter(movie => {
        const matchesSearch =
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm) ||
            movie.year.includes(searchTerm);

        const matchesGenre =
            selectedGenre === "all" ||
            movie.genre.includes(selectedGenre);

        return matchesSearch && matchesGenre;
    });

    if (selectedSort === "rating") {
        filteredMovies.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "year-new") {
        filteredMovies.sort((a, b) => b.year.localeCompare(a.year));
    } else if (selectedSort === "year-old") {
        filteredMovies.sort((a, b) => a.year.localeCompare(b.year));
    } else if (selectedSort === "title") {
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderMovies(filteredMovies, movieGrid);
    movieCount.textContent = `${filteredMovies.length} movies found`;
}



// Display all movies when the page first opens.
renderMovies(movies, movieGrid);
updateFavorites();

// Search when the form is submitted.

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchTMDB(searchInput.value);
});

genreFilter.addEventListener("change", function() {
    searchMovies(searchInput.value);
});

sortBy.addEventListener("change", function() {
    searchMovies(searchInput.value);
});

// Add or remove a movie from the watchlist.
document.addEventListener("click", function(event) {
    const button = event.target.closest(".favorite-btn");

    if (!button) return;

    const movieId = Number(button.dataset.movieId);

    if (favorites.includes(movieId)) {
        favorites = favorites.filter(id => id !== movieId);
    } else {
        favorites.push(movieId);
    }

    // Update both sections so their buttons stay in sync.
    searchMovies(searchInput.value);
    updateFavorites();
});

function openMovieDetails(movie) {
      loadMovieTrailer(movie.id);
    modalPoster.src = movie.poster;
    modalPoster.alt = `${movie.title} movie poster`;
    modalTitle.textContent = movie.title;
    modalMeta.textContent = `${movie.year} · ${movie.genre}`;
    modalDescription.textContent = movie.description;
    modalRating.textContent = `★ ${movie.rating} / 10`;

    movieModal.classList.add("open");
    movieModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    modalClose.focus();
}

function closeMovieDetails() {
    movieModal.classList.remove("open");
    movieModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    trailerPlayer.src = "";
    trailerContainer.hidden = true;
    trailerButton.hidden = true;
}


document.addEventListener("click", function(event) {
    const card = event.target.closest(".movie-card");

    if (!card || event.target.closest(".favorite-btn")) {
        return;
    }

    const movieId = Number(
    card.querySelector(".favorite-btn").dataset.movieId
);

const movie = allMovies.find(item => item.id === movieId);

    if (movie) {
        openMovieDetails(movie);
    }
});


modalClose.addEventListener("click", closeMovieDetails);

movieModal.addEventListener("click", function(event) {
    if (event.target === movieModal) {
        closeMovieDetails();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && movieModal.classList.contains("open")) {
        closeMovieDetails();
    }
});



async function loadMovieTrailer(movieId) {
    trailerButton.hidden = true;
    trailerContainer.hidden = true;
    trailerPlayer.src = "";

    try {
        const response = await fetch(
            `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error("Could not load trailers");
        }

        const data = await response.json();

        const trailer = data.results.find(video =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.key
        );

        if (trailer) {
            trailerButton.hidden = false;

            trailerButton.onclick = () => {
                trailerPlayer.src =
                    `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`;

                trailerContainer.hidden = false;
                trailerButton.hidden = true;
            };
        }
    } catch (error) {
        console.error("Trailer error:", error);
    }
}



async function searchTMDB(query, page = 1, loadMore = false) {
    if (!query.trim()) {
        searchMovies("");
        return;
    }

    try {
        currentSearchQuery = query;
        currentSearchPage = page;

        const response = await fetch(
            `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`
        );

        if (!response.ok) {
            throw new Error("Movie search failed");
        }

        const data = await response.json();

        totalSearchPages = data.total_pages;
        loadMoreButton.hidden = currentSearchPage >= totalSearchPages;

        const searchResults = data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date
                ? movie.release_date.substring(0, 4)
                : "N/A",
            rating: movie.vote_average || 0,
            genre: (movie.genre_ids || []).map(id =>
                ({
                    28: "Action",
                    12: "Adventure",
                    16: "Animation",
                    35: "Comedy",
                    18: "Drama",
                    14: "Fantasy",
                    27: "Horror",
                    10749: "Romance",
                    878: "Sci-Fi",
                    53: "Thriller"
                })[id] || "Other"
            ).join(", "),
            description: movie.overview || "No description available.",
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : ""
        }));

        if (loadMore) {
            allMovies = [...allMovies, ...searchResults];
        } else {
            allMovies = searchResults;
        }

        renderMovies(allMovies, movieGrid);

        movieCount.textContent =
            `${allMovies.length} movies loaded (${data.total_results} results found)`;

        updateFavorites();

    } catch (error) {
        console.error("Search error:", error);
        movieCount.textContent = "Could not search movies. Please try again.";
    }
}


document.getElementById("home-link").addEventListener("click", function () {
    searchInput.value = "";
    genreFilter.value = "all";
    sortBy.value = "default";

    currentSearchPage = 1;
    totalSearchPages = 1;
    currentSearchQuery = "";

    fetchPopularMovies();
    loadMoreButton.hidden = true;
});


fetchPopularMovies();

loadMoreButton.addEventListener("click", function () {
    if (currentSearchPage < totalSearchPages) {
        searchTMDB(
            currentSearchQuery,
            currentSearchPage + 1,
            true
        );
    }
});
