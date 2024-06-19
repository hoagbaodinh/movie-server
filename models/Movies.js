const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "movieList.json"
);
const pGenre = path.join(
  path.dirname(require.main.filename),
  "data",
  "genreList.json"
);
const pVideo = path.join(
  path.dirname(require.main.filename),
  "data",
  "videoList.json"
);
const pToken = path.join(
  path.dirname(require.main.filename),
  "data",
  "userToken.json"
);
const pMediaType = path.join(
  path.dirname(require.main.filename),
  "data",
  "mediaTypeList.json"
);

const getDataFromFile = (cb, path) => {
  fs.readFile(path, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Movies {
  static allMovies(cb) {
    getDataFromFile(cb, p);
  }
  static genre(cb) {
    getDataFromFile(cb, pGenre);
  }

  static mediaType(cb) {
    getDataFromFile(cb, pMediaType);
  }
  static userToken(cb) {
    getDataFromFile(cb, pToken);
  }
  static videos(cb) {
    getDataFromFile(cb, pVideo);
  }
};
