const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3010;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    fileName: './BD4-1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllMovies() {
  let query = 'SELECT * FROM movies';
  let response = await db.all(query, []);
  return { movies: response };
}

app.get('/movies', async (req, res) => {
  let results = fetchAllMovies();
  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
