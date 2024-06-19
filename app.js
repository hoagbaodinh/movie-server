const express = require("express");
const bodyParser = require("body-parser");
const moviesRouter = require("./routes/movie");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(moviesRouter);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  console.log(status, message);
  res.status(status).json({ message: message });
});

app.listen(5050);
