const Movies = require("../models/Movies");

// Lay genreList va MediaType tu file json
exports.getGenreAndType = (req, res) => {
  Movies.genre((genres) => {
    Movies.mediaType((mediaTypes) => {
      res.status(200).json({ genres, mediaTypes });
    });
  });
};

// Lay cac movie Trending
exports.getMoviesTrending = (req, res) => {
  Movies.allMovies((movies) => {
    let pageNum = 1;
    // Neu nguoi dung truyen tham so page vao request
    if (req.query.page) pageNum = parseInt(req.query.page);
    // Sap xep cac phim tu muc do popular
    const trendingMovies = movies
      .sort((a, b) => b.popularity - a.popularity)
      .slice(20 * (pageNum - 1), 20 * pageNum); // lay 20 movies

    // Tra ve
    res.status(200).json({
      results: trendingMovies,
      page: pageNum,
      totalPages: Math.trunc(movies.length / 20),
    });
  });
};

// Lay cac movie theo luot danh gia
exports.getMoviesTopRated = (req, res) => {
  Movies.allMovies((movies) => {
    let pageNum = 1;
    // Neu nguoi dung truyen tham so page vao request
    if (req.query.page) pageNum = parseInt(req.query.page);

    // Loc movie theo vote
    const topRatedMovies = movies
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(20 * (pageNum - 1), 20 * pageNum);

    // Tra ve
    res.status(200).json({
      results: topRatedMovies,
      page: pageNum,
      totalPages: Math.trunc(movies.length / 20),
    });
  });
};

// Lay cac movie theo genre
exports.getMoviesByGenre = (req, res) => {
  const genreId = +req.params.genreId;
  let pageNum = 1;
  // Neu nguoi dung truyen tham so page vao request
  if (req.query.page) pageNum = parseInt(req.query.page);

  // Neu k co params genreId thi bao loi 400 kem mes
  if (!genreId)
    return res.status(400).json({ message: "Not found genre parram" });

  Movies.allMovies((movies) => {
    Movies.genre((genre) => {
      // Tim xem genreId co ton tai hay khong
      const genreName = genre.find((g) => g.id === genreId);

      // Neu ton tai
      if (genreName) {
        // Loc ra cac phim co chua the loai theo genreId
        const filteredMovies = movies.filter((m) =>
          m.genre_ids.includes(genreId)
        );
        // Lay ra 20 movie
        const discoverMovies = filteredMovies.slice(
          20 * (pageNum - 1),
          20 * pageNum
        );

        // Tra ve
        res.status(200).json({
          results: discoverMovies,
          page: pageNum,
          totalPages: filteredMovies.length / 20,
          genre: genreName.name,
        });
      } else
        return res.status(400).json({ message: "Not found that genre id" }); // Neu khong ton tai thi tra ve loi 400 voi mes
    });
  });
};

// Lay trailer theo movie Id
exports.postMovieVideoById = (req, res) => {
  const movieId = req.body.movieId;
  // neu khong co movieId
  if (!movieId)
    return res.status(400).json({ message: "Not found film_id parram" });

  Movies.videos((movieVideos) => {
    const videos = movieVideos.find((video) => video.id === movieId);
    // Neu khong tim thay video
    if (!videos?.videos)
      return res.status(404).json({ message: "Not found video" });

    // Tim cac trailer co cac site ve type phu hop voi yeu cau
    const trailers = videos?.videos.filter(
      (result) =>
        result.site === "YouTube" &&
        (result.type === "Trailer" || result.type === "Teaser")
    );

    // Lay trailer co ngay san xuat gan nhat
    const trailer = trailers?.reduce((prev, current) =>
      Date.parse(prev.published_at) > Date.parse(current.published_at)
        ? prev
        : current
    );

    // Tra ve
    res.status(200).json({ results: trailer || [] });
  });
};

// Lay movie theo keyword
exports.postMoviesByKeyword = (req, res) => {
  let pageNum = 1;
  // Neu nguoi dung truyen tham so page vao request
  if (req.body.page) pageNum = parseInt(req.body.page);

  // Bo cac khoang trang cua key word
  const keywords = req.body.keywords
    .toLowerCase()
    .replace(/\s\s+/g, " ")
    .split(" ");

  const genre = req.body.genre;
  const type = req.body.type;
  const language = req.body.language;
  const year = req.body.year;

  // Neu khong ton tai keyword thi bao loi 400
  if (!keywords)
    return res.status(400).json({ message: "Not found keyword param" });
  Movies.allMovies((movies) => {
    let filteredMovies;
    // Loc theo keyword
    keywords.forEach(
      (keyword) =>
        (filteredMovies = movies.filter(
          (movie) =>
            movie.title?.toLowerCase().includes(keyword) ||
            movie.name?.toLowerCase().includes(keyword) ||
            movie.overview?.toLowerCase().includes(keyword)
        ))
    );

    // Genre Search
    if (genre !== "all") {
      filteredMovies = filteredMovies.filter((m) =>
        m.genre_ids.includes(+genre)
      );
    }

    // MediaType search
    if (type !== "all") {
      filteredMovies = filteredMovies.filter((m) => m.media_type === type);
    }

    // Language search
    if (language !== "all") {
      filteredMovies = filteredMovies.filter(
        (m) => m.original_language === language
      );
    }

    //Year search
    if (year !== "all") {
      filteredMovies = filteredMovies.filter((m) => {
        const releaseDate = new Date(m.release_date || m.first_air_date);
        console.log(releaseDate.getFullYear());
        return +releaseDate.getFullYear() === +year;
      });
    }

    //Tra ve
    res.json({
      results: filteredMovies.slice(20 * (pageNum - 1), 20 * pageNum),
      page: pageNum,
      totalPages: Math.trunc(filteredMovies.length / 20),
    });
  });
};

// Sai endpoint
exports.get404 = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};
