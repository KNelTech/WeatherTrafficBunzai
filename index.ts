import { Bunzai, Logger } from "bunzai";
import type { JSXComponent, Context, Next, Middleware } from "bunzai";
import { Main } from "./front/pages/main.tsx";
import { getWeatherForDisplay } from "./myMiddleware/getWeather.ts";

const app = new Bunzai();

app.static("/styles", "front/styles");

app.use(Logger());

app.get("/", (c: Context) => {
  return c.jsx(Main, null);
});

// New route for weather API
app.get("/api/display-weather", async (c: Context) => {
  try {
    const weatherData = await getWeatherForDisplay();
    return c.json(weatherData);
  } catch (error) {
    console.error('Error fetching display weather data:', error);
    return c.serverError('Failed to fetch weather data');
  }
});

app.listen().then(() => {
  console.log("Server running on http://localhost:3000");
});