//https://home.openweathermap.org/

const API_TOKEN = Bun.env.API_TOKEN;

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface CleanedForecastItem {
  dt: number;
  temp: number;
  feels_like: number;
  description: string;
  wind_speed: number;
  precipitation_chance: number;
  main_condition: string;
  rain?: number;
  snow?: number;
}

const locations: Location[] = [
  { name: "Diana's work", lat: 41.982330, lon: -88.035810 },
  { name: "Kodi's work", lat: 41.887920, lon: -87.665649 },
  { name: "Home", lat: 41.924940, lon: -87.776010 }
];

function convertUnixToCSTTime(unixTime: number): string {
  const cstDate = new Date(unixTime * 1000);
  const cstFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return cstFormatter.format(cstDate);
}

async function fetchWeatherForecast(location: Location) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&cnt=8&units=imperial&appid=${API_TOKEN}&units=metric`;
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const cleanedData: CleanedForecastItem[] = data.list.map((item: any) => ({
    cst_time: convertUnixToCSTTime(item.dt),
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    main_condition: item.weather[0].main,
    description: item.weather[0].description,
    wind_speed: item.wind.speed,
    precipitation_chance: item.pop,
    rain: item.rain?.['3h'],
    snow: item.snow?.['3h']
  }));

  return { [location.name]: cleanedData };
}

export async function getWeatherForDisplay() {
  try {
    const weatherPromises = locations.map(location => fetchWeatherForecast(location));
    const weatherResults = await Promise.all(weatherPromises);
    return Object.assign({}, ...weatherResults);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}