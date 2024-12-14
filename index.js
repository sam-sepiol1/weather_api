import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const corsOptions = {
	origin: ['https://weather-app-zeta-inky.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: false,
};

// app.use(cors());

const port = 3000;
const apiKey = process.env.API_KEY;
const unsplashApiKey = process.env.UNSPLASH_API_KEY;

let API_CITIES_URL;
let API_WEATHER_URL;

async function getImages(city_name) {
	API_CITIES_URL = `https://api.unsplash.com/search/photos?query=${city_name}&client_id=${unsplashApiKey}`;
	const response = await fetch(API_CITIES_URL);
	const data = await response.json();
	return data;
}

async function getRandomImage() {
	API_CITIES_URL = `https://api.unsplash.com/photos/random?query=nature&client_id=${unsplashApiKey}`;
	const response = await fetch(API_CITIES_URL);
	const data = await response.json();
	return data;
}

async function getCities(city_name) {
	API_CITIES_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=10&appid=${apiKey}`;
	const response = await fetch(API_CITIES_URL);
	const data = await response.json();
	return data;
}

async function getWeather(city_name) {
	let city = await getCities(city_name);

	let lat = city[0].lat;
	let lon = city[0].lon;

	API_WEATHER_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	const response = await fetch(API_WEATHER_URL);
	const weather = await response.json();
	return weather;
}

async function getWeatherCoords(lat, lon) {
	API_WEATHER_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	const response = await fetch(API_WEATHER_URL);
	const weather = await response.json();
	return weather;	
}

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' });
});

app.get('/cities/:city', async (req, res) => {
	let city_name = req.params.city;
	let cities = await getCities(city_name);
	res.json(cities);
});

app.get('/weather/:city', async (req, res) => {
	let city_name = req.params.city;

	let weather = await getWeather(city_name);
	res.json(weather);
});

app.get('/weather/:lat/:lon', async (req, res) => {
	let lat = req.params.lat;
	let lon = req.params.lon;

	let weather = await getWeatherCoords(lat, lon);
	res.json(weather);
});

app.get('/images/:city', async (req, res) => {
	let city_name = req.params.city;
	let images = await getImages(city_name);
	res.json(images);
});

app.get('/image', async (req, res) => {
	let images = await getRandomImage();
	res.json(images);
});

app.listen(port, () => {});
