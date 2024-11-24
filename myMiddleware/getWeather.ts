// //https://home.openweathermap.org/


interface WeatherResponse {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
    };
    weather: {
      description: string;
    }[];
    wind: {
      speed: number;
    };
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
  }[];
}

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface WeatherDataPoint {
  cst: string;
  temp: number;
  feels_like: number;
  description: string;
  wind_speed: number;
  pop: number;
  rain?: number;
  snow?: number;
}


export class GetWeather {
  private readonly API_TOKEN: string;
  private readonly locations: {
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

  private async fetchWeatherData(location: Location): Promise<WeatherResponse> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&cnt=8&units=imperial&appid=${this.API_TOKEN}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as WeatherResponse;
    } catch (error) {
      console.error(`Error fetching weather data for ${location.name}:`, error);
      throw error;
    }
  }

  private cleanWeatherData(data: WeatherResponse, locationName: string): Record<string, WeatherDataPoint[]> {
    const cleanedData = data.list.map(item => ({
      cst: new Date(item.dt * 1000).toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      wind_speed: Math.round(item.wind.speed),
      pop: item.pop,
      ...(item.rain && { rain: Math.round(item.rain['3h']) }),
      ...(item.snow && { snow: Math.round(item.snow['3h']) })
    }));
  
    return { [locationName]: cleanedData };
  }
  
  public async getWeatherForDisplay(): Promise<Record<string, WeatherDataPoint[]>> {
    const results: Record<string, WeatherDataPoint[]> = {};
    const errors: Error[] = [];
  
    await Promise.all(
      this.locations.map(async location => {
        try {
          const data = await this.fetchWeatherData(location);
          Object.assign(results, this.cleanWeatherData(data, location.name));
        } catch (error) {
          errors.push(error as Error);
        }
      })
    );

    if (errors.length === this.locations.length) {
      throw new Error('Failed to fetch weather data for all locations');
    }

    if (errors.length > 0) {
      console.warn(`Failed to fetch weather data for ${errors.length} location(s):`, errors);
    }

    return results;
  }
}