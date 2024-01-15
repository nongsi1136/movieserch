require("dotenv").config();
const apiKey = process.env.API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  // 페이지 로드 시에도 영화 목록을 가져오기 위한 함수 실행
  // 검색어가 없을 때, fetchMovies 함수에서 검색어를 처리하는 부분에서 문제가 없도록 빈 문자열을 전달.

  fetchMovies("https://api.themoviedb.org/3/discover/movie", "");

  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim(); // 입력값 가져오기

    let url = "https://api.themoviedb.org/3/discover/movie"; // 초기 URL 설정

    if (searchTerm) {
      url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}`;
    }

    fetchMovies(url, searchTerm); // 수정된 fetchMovies 함수를 호출하여 영화 목록을 가져옴
  });
});

function fetchMovies(url, searchTerm) {
  const movieList = document.getElementById("movieList");
  const mainCenter = document.querySelector(".mainCenter");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjJkNGM2MDFhZTk0NTMxNDJhYjYzNzM3MmNjZGMyMyIsInN1YiI6IjY1OWIwYjQ2NGQwZThkMDFmZDllODM0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IOBusNVTR-x3iLaAWMoRLPJOvIOg5EaIj2I4hjQJxIE",
    },
  };

  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${searchTerm}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      // 검색 결과를 화면에 표시
      while (movieList.firstChild) {
        movieList.removeChild(movieList.firstChild);
      }

      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
      });

      mainCenter.insertAdjacentElement("afterend", movieList);
    })
    .catch((err) => console.error("영화를 불러오는 중 에러 발생:", err));
}

// 받아온 영화 정보를 바탕으로 영화 카드를 생성하는 함수
const createMovieCard = (movie) => {
  // 영화 정보 분해
  const { title, overview, poster_path, vote_average, id } = movie;

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const overviewElement = document.createElement("p");
  overviewElement.textContent = overview;

  const posterUrl = `https://image.tmdb.org/t/p/w500/${poster_path}`;
  const posterImage = document.createElement("img");
  posterImage.setAttribute("src", posterUrl);
  posterImage.setAttribute("alt", `${title} 포스터`);

  const voteAverageElement = document.createElement("p");
  voteAverageElement.textContent = `평점: ${vote_average}`;

  movieCard.appendChild(titleElement);
  movieCard.appendChild(overviewElement);
  movieCard.appendChild(posterImage);
  movieCard.appendChild(voteAverageElement);

  // 영화 카드 클릭 시 영화 ID 알림창으로 보여주기
  movieCard.addEventListener("click", () => {
    alert(`선택한 영화 ID: ${id}`);
  });

  return movieCard;
};
