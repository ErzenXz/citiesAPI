const express = require('express');
const app = express();
const fs = require('fs');

// Load the cities data from JSON file
const cities = JSON.parse(fs.readFileSync('cities.json'));

// Define the endpoint for geolocation search
app.get('/find', (req, res) => {
    const { lan, lon } = req.query;
    const cityName = getCityNameFromGeolocation(cities, lan, lon);
    res.json(cityName);
});

// app.get('/search', (req, res) => {
//     const query = req.query.query;
//     if (!query) {
//         res.status(400).json({ error: 'Missing query parameter' });
//         return;
//     }

//     const matchingCities = cities.filter(city => city.city_ascii.toUpperCase().startsWith(query.toUpperCase()));
//     res.json({ results: matchingCities });
// });

app.get('/search', (req, res) => {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }

    const matchingCities = cities.filter(city => city.city_ascii.toUpperCase().startsWith(query.toUpperCase()));
    if (matchingCities.length === 0) {
        res.json({ message: 'No cities found' });
        return;
    }

    const limitedResults = matchingCities.slice(0, 100);
    res.json({ results: limitedResults });
});

app.get('/info', (req, res) => {
    const count = cities.length;
    res.json({ count });
});



// Define the function to retrieve city name from geolocation
function getCityNameFromGeolocation(data, lan, lon) {
    for (const location of data) {
        if (Math.abs(location.lat - lan) <= 0.1 && Math.abs(location.lng - lon) <= 0.1) {
            return location;
        }
    }
    return {
        status: "error",
        message: "City not found"
    };
}


// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
