import type { JSXComponent, Context, Middleware } from "bunzai";
import type { WeatherDataPoint,  LocationWeatherData } from "../../myMiddleware/getWeather";

class WeatherService {
  private dianasWork: WeatherDataPoint[] = [];
  private kodisWork: WeatherDataPoint[] = [];
  private home: WeatherDataPoint[] = [];

  static async fetchWeatherData(): Promise<LocationWeatherData> {
    try {
      const response = await fetch('/api/display-weather');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: LocationWeatherData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static splitWeatherData(data: LocationWeatherData): {
    dianasWork: WeatherDataPoint[];
    kodisWork: WeatherDataPoint[];
    home: WeatherDataPoint[];
  } {
    const dianasWork = data["Diana's work"] || [];
    const kodisWork = data["Kodi's work"] || [];
    const home = data['Home'] || [];

    return { dianasWork, kodisWork, home };
  }
}



// class WeatherDataByLocation {
//   static async fetchWeatherData(): Promise<WeatherDataByLocation | null> {
//     try {
//       const response = await fetch('/api/display-weather');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const weatherData = (await response.json()) as WeatherDataByLocation;
//       return weatherData;
//     } catch (error) {
//       console.error('Error fetching weather data:', error); FUCKKKKKK
//       return null;
//     }
//   }
// }
export const weatherContainer: JSXComponent<{ name: string }> = ({ name }) => `
  <div>
    <h1>Hello, ${name}</h1>
    <p>This is a JSX component rendered by Bunzai.</p>
  </div>
`;

export const AnotherComponent: JSXComponent<{ message: string }> = ({ message }) => `
  <div>
    <p>${message}</p>
  </div>
`;