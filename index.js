import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();

const port = 3000;
const apiKey = process.env.API_KEY;

let API_CITIES_URL;
let API_WEATHER_URL;


const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000' ,'https://13-weather-l0mq87u22-sam-sepiols-projects-c25eb3a9.vercel.app', 'http://127.0.0.1:3000/index.html'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
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

app.listen(port, () => {});
