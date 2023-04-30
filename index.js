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
