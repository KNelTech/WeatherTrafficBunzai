import type { JSXComponent } from "bunzai";


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