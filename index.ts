import { Bunzai, jsxPlugin, Logger, staticPlugin  } from "bunzai";
import type { JSXComponent, Context, Next, Middleware } from "bunzai";
import { Main, WeatherService } from "./front/pages/main.tsx";
import { GetWeather } from "./myMiddleware/getWeather.ts";


const app = new Bunzai({errorHandler: true})
.plugin(jsxPlugin());

app.plugin(staticPlugin('/styles', 'front/styles'));

app.use(Logger());

app.get("/api/display-weather", async (c: Context) => {
  try {
    const data = await new GetWeather().getWeatherForDisplay();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching display weather data:', error);
    return c.serverError('Failed to fetch weather data');
  }

  // const weatherService = new WeatherService()
  // const data = await WeatherService.fetchWeatherData()
  // if (!data) {
  //   return c.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  // }
  // weatherService.updateWeatherData(data) // Store the data
  // return c.json(data as any)
});

app.get("/", async (c: Context) => {
  const weatherService = new WeatherService();
  const data = {
    "Diana's work": weatherService.dianasWork,
    "Kodi's work": weatherService.kodisWork,
    "Home": weatherService.home
  };
  return c.jsx(Main, { data });
});


app.listen().then(() => {
  console.log("Server running on http://localhost:3000");
});