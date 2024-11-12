//https://www.weatherapi.com/my/

const API_KEY = Bun.env.API_TOKEN; 



async function fetchWeather(zipCode: string) {
    const url = `https://api.weatherapi.com/v1/current.json?q=${zipCode}&key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }
  
  function cleanWeatherData(data: any) {
    return {
      location: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon
    };
  }
  
  export async function getWeatherForDisplay() {
    const zipCodes = ['60639', '60143', '60607']; 
  
    try {
      const weatherPromises = zipCodes.map(zipCode => fetchWeather(zipCode));
      const weatherResults = await Promise.all(weatherPromises);
  
      return weatherResults.map(cleanWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }


  // front? I guess? I'm TIRED

//   async function loadDisplayWeatherData() {
//     const response = await fetch('/api/display-weather');
//     if (!response.ok) {
//       throw new Error('Failed to fetch display weather data');
//     }
//     return response.json();
//   }
  
//   // Usage
//   loadDisplayWeatherData()
//     .then(weatherData => {
//       console.log(weatherData);
//       // weatherData will be an array of objects like:
//       // [
//       //   {
//       //     location: 'Chicago',
//       //     current: {
//       //       temperature: 22,
//       //       condition: 'Partly cloudy',
//       //       icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
//       //     },
//       //     forecast: [
//       //       { date: '2023-12-11', maxTemp: 24, minTemp: 18, condition: 'Sunny', icon: '...' },
//       //       { date: '2023-12-12', maxTemp: 23, minTemp: 17, condition: 'Cloudy', icon: '...' },
//       //       // ... (7 days total)
//       //     ]
//       //   },
//       //   // ... (data for other zip codes)
//       // ]
//       // Update your UI with this weather data
//     })
//     .catch(error => {
//       console.error('Error loading display weather data:', error);
//       // Handle the error in your UI
//     });