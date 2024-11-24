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
  try {
    const dbPath = resolve(__dirname, './BD4-1/database.sqlite');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { movies: response };
}

async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.all(query, [id]);
  return { movies: response };
}

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { movies: response };
}

async function fetchRestaurantsByQuerys(isVeg,hasOutdoorSeating,isLuxury) {
  if(isVeg && hasOutdoorSeating && isLuxury){
    let query = "SELECT * FROM restaurants WHERE isVeg='true' AND hasOutdoorSeating='true' AND isLuxury='true'";
    let response = await db.all(query, []);
    return { movies: response };
  }else if(isVeg && hasOutdoorSeating){
    let query = "SELECT * FROM restaurants WHERE isVeg='true' AND hasOutdoorSeating='true'";
    let response = await db.all(query, []);
    return { movies: response };
  }
  else if(isVeg){
    let query = "SELECT * FROM restaurants WHERE isVeg='true'";
    let response = await db.all(query, []);
    return { movies: response };
  }else if(hasOutdoorSeating){
    let query = "SELECT * FROM restaurants WHERE hasOutdoorSeating='true'";
    let response = await db.all(query, []);
    return { movies: response };
  }else if(isLuxury){
    let query = "SELECT * FROM restaurants WHERE isLuxury='true'";
    let response = await db.all(query, []);
    return { movies: response };
  }
  
}

async function fetchRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { movies: response };
}

async function fetchDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { movies: response };
}

async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);
  return { movies: response };
}

async function fetchDishesByFilter(isVeg) {
  if(isVeg){
  let query = "SELECT * FROM dishes WHERE isVeg='true'";
  let response = await db.all(query, []);
  return { movies: response };
  }
}

async function fetchDishesBySort() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { movies: response };
}

app.get('/restaurants', async (req, res) => {
  let results = await fetchAllRestaurants();
  res.status(200).json(results);
});

app.get('/restaurants/details/:id', async (req, res) => {
  let id=req.params.id;
  let results = await fetchRestaurantsById(id);
  res.status(200).json(results);
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine=req.params.cuisine;
  let results = await fetchRestaurantsByCuisine(cuisine);
  res.status(200).json(results);
});

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg === 'true';
  let hasOutdoorSeating = req.query.hasOutdoorSeating === 'true';
  let isLuxury = req.query.isLuxury === 'true';
  let results = await fetchRestaurantsByQuerys(isVeg,hasOutdoorSeating,isLuxury);
  res.status(200).json(results);
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  let results = await fetchRestaurantsByRating();
  res.status(200).json(results);
});

app.get('/dishes', async (req, res) => {
  let results = await fetchDishes();
  res.status(200).json(results);
});

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  let results = await fetchDishesById(id);
  res.status(200).json(results);
});

app.get('/dishes/filter/', async (req, res) => {
  let isVeg = req.query.isVeg==='true';
  let results = await fetchDishesByFilter(isVeg);
  res.status(200).json(results);
});

app.get('/dishes/sort-by-price/', async (req, res) => {
  let results = await fetchDishesBySort();
  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
