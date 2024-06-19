const express = require('express');
const bodyParser = require('body-parser');
const moviesRouter = require('./routes/movie');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://movie-client-zkmn.onrender.com'],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(moviesRouter);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  console.log(status, message);
  res.status(status).json({ message: message });
});
const server = http.createServer(app);

server.listen(5050);
