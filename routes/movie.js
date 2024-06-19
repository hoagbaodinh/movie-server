const express = require("express");
const moviesController = require("../controllers/movie");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");

router.use(checkAuth);
// API
router.get("/api/movies/trending", moviesController.getMoviesTrending);
router.get("/api/movies/top-rate", moviesController.getMoviesTopRated);
router.get("/api/movies/discover/:genreId?", moviesController.getMoviesByGenre);
router.post("/api/movies/video", moviesController.postMovieVideoById);
router.post("/api/movies/search", moviesController.postMoviesByKeyword);
router.get("/api/genres-types", moviesController.getGenreAndType);
// Khi sai endpoint
router.use(moviesController.get404);

module.exports = router;
