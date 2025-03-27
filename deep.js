document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = '8a680ac215864fe7ab3163724252703';
    const weatherWidget = document.querySelector('.weather-widget');
    
    if (!weatherWidget) {
        console.error('Error: .weather-widget not found in DOM');
        return;
    }

    async function fetchWeather(location) {
        const tempElement = weatherWidget.querySelector('.weather-temp');
        const descElement = weatherWidget.querySelector('.weather-desc');
        
        if (!tempElement || !descElement) {
            console.error('Error: .weather-temp or .weather-desc not found');
            return;
        }

        try {
            tempElement.textContent = 'Loading...';
            descElement.textContent = '';
            
            const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const weatherData = await response.json();
            updateWeatherDisplay(weatherData);
            
        } catch (error) {
            console.error('Weather fetch error:', error.message);
            tempElement.textContent = 'Error';
            descElement.textContent = error.message;
        }
    }

    function updateWeatherDisplay(data) {
        const tempElement = weatherWidget.querySelector('.weather-temp');
        const descElement = weatherWidget.querySelector('.weather-desc');
        
        tempElement.textContent = `${Math.round(data.current.temp_c)}°C`;
        descElement.textContent = data.current.condition.text;
    }

    const searchWeatherBtn = document.getElementById('searchWeather');
    const locationInput = document.getElementById('locationInput');

    if (searchWeatherBtn && locationInput) {
        searchWeatherBtn.addEventListener('click', function() {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            } else {
                alert('Please enter a location');
            }
        });

        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWeatherBtn.click();
            }
        });
    }
});