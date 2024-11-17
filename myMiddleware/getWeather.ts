// //https://home.openweathermap.org/

export class GetWeather {
  private API_TOKEN: string;
  private locations: {
    name: string;
    lat: number;
    lon: number;
  }[];

  constructor() {
    this.API_TOKEN = Bun.env.API_TOKEN!;
    this.locations = [
      { name: "Diana's work", lat: 41.982330, lon: -88.035810 },
      { name: "Kodi's work", lat: 41.887920, lon: -87.665649 },
      { name: "Home", lat: 41.924940, lon: -87.776010 }
    ];
  }

  private async fetchWeatherForecast(location: Location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&cnt=8&units=imperial&appid=${this.API_TOKEN}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const cleanedData = data.list.map((item: any) => ({
      cst: new Date(item.dt * 1000).toLocaleString(),
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      description: item.weather[0].description,
      wind_speed: item.wind.speed,
      pop: item.pop,
      rain: item.rain?.['3h'],
      snow: item.snow?.['3h']
    }));

    return { [location.name]: cleanedData };
  }

  public  async getWeatherForDisplay() {
    try {
      const weatherPromises = this.locations.map(location => this.fetchWeatherForecast(location));
      const weatherResults = await Promise.all(weatherPromises);
      return Object.assign({}, ...weatherResults);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
}