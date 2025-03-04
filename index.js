import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();

const corsOptions = {
	origin: ['https://weather-app-zeta-inky.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:3000'],
	methods: ['GET', 'POST'],
	credentials: false,
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, 
	message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(cors(corsOptions));
app.use(limiter);

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
	let city_name_encoded = encodeURI(city_name);
	API_CITIES_URL = `http://api.geonames.org/searchJSON?q=${city_name_encoded}&maxRows=10&featureClass=P&username=sam_sepiol`;
	const response = await fetch(API_CITIES_URL);
	const data = await response.json();
	return data;
}

async function getWeather(city_name) {
	let city = await getCities(city_name);

	let coordinates = await getCoordinates(city_name);
	let lat = coordinates[0].lat;
	let lon = coordinates[0].lon;

	API_WEATHER_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=1`;
	const response = await fetch(API_WEATHER_URL);

	if (!response.ok) {
		throw new Error('Error fetching weather data: ' + response.statusText);
	}

	const weather = await response.json();
	return weather;
}

async function getCoordinates(city_name) {
	API_WEATHER_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${apiKey}`;
	const response = await fetch(API_WEATHER_URL);

	if (!response.ok) {
		throw new Error('Error fetching coordinates: ' + response.statusText);
	}

	const data = await response.json();
	return data;
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
