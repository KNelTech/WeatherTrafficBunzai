import type { JSXComponent } from 'bunzai'

export interface WeatherEntry {
  cst: string
  temp: number
  feels_like: number
  description: string
  wind_speed: number
  pop: number
  rain?: number
  snow?: number
}

export interface WeatherData {
  [location: string]: WeatherEntry[]
}

export interface WeatherResponse {
  list: {
    dt: number
    main: {
      temp: number
      feels_like: number
    }
    weather: {
      description: string
    }[]
    wind: {
      speed: number
    }
    pop: number
    rain?: {
      '3h': number
    }
    snow?: {
      '3h': number
    }
  }[]
}

export class WeatherService {
  private static API_TOKEN = Bun.env.API_TOKEN!
  private static locations = [
    { name: "Diana's work", lat: 41.98233, lon: -88.03581 },
    { name: "Kodi's work", lat: 41.88792, lon: -87.665649 },
    { name: 'Home', lat: 41.92494, lon: -87.77601 }
  ]

  public dianasWork: WeatherEntry[] = []
  public kodisWork: WeatherEntry[] = []
  public home: WeatherEntry[] = []

  private static async fetchWeatherData(location: {
    name: string
    lat: number
    lon: number
  }): Promise<WeatherResponse> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&cnt=8&units=imperial&appid=${this.API_TOKEN}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as WeatherResponse
  }

  private static cleanWeatherData(data: WeatherResponse): WeatherEntry[] {
    return data.list.map((item) => ({
      cst: new Date(item.dt * 1000).toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      wind_speed: Math.round(item.wind.speed),
      pop: item.pop,
      rain: item.rain ? Math.round(item.rain['3h']) : undefined,
      snow: item.snow ? Math.round(item.snow['3h']) : undefined
    }))
  }

  static async fetchAllWeatherData(): Promise<WeatherData> {
    const weatherData: WeatherData = {}
    const errors: Error[] = []

    await Promise.all(
      this.locations.map(async (location) => {
        try {
          const data = await this.fetchWeatherData(location)
          weatherData[location.name] = this.cleanWeatherData(data)
        } catch (error) {
          console.error(`Error fetching weather data for ${location.name}:`, error)
          errors.push(error as Error)
        }
      })
    )

    if (errors.length === this.locations.length) {
      throw new Error('Failed to fetch weather data for all locations')
    }

    return weatherData
  }

  updateWeatherData(data: WeatherData): void {
    this.dianasWork = data["Diana's work"] || []
    this.kodisWork = data["Kodi's work"] || []
    this.home = data['Home'] || []
  }
}

const dianasWork: JSXComponent<{ data: WeatherEntry[] }> = ({ data }) => `
  <div>
    <h2>Diana's Work</h2>
    ${data
      .map(
        (entry) => `
      <div class="weather-card">
        <p class="time">Time: ${entry.cst}</p>
        <p class="temperature">Temperature: ${entry.temp}°F</p>
        <p>Feels like: ${entry.feels_like}°F</p>
        <p class="description">${entry.description}</p>
        <p class="wind">Wind Speed: ${entry.wind_speed} mph</p>
        <p class="precipitation">Chance of Precipitation: ${Math.round(entry.pop * 100)}%</p>
        ${entry.rain ? `<p class="rain">Rain: ${entry.rain} mm</p>` : ''}
        ${entry.snow ? `<p class="snow">Snow: ${entry.snow} mm</p>` : ''}
      </div>
    `
      )
      .join('')}
  </div>
`

const kodisWork: JSXComponent<{ data: WeatherEntry[] }> = ({ data }) => `
  <div>
    <h2>Kodi's Work</h2>
    ${data
      .map(
        (entry) => `
      <div class="weather-card">
        <p class="time">Time: ${entry.cst}</p>
        <p class="temperature">Temperature: ${entry.temp}°F</p>
        <p class="feels-like">Feels like: ${entry.feels_like}°F</p>
        <p class="description">${entry.description}</p>
        <p class="wind">Wind Speed: ${entry.wind_speed} mph</p>
        <p class="precipitation">Chance of Precipitation: ${Math.round(entry.pop * 100)}%</p>
        ${entry.rain ? `<p class="rain">Rain: ${entry.rain} mm</p>` : ''}
        ${entry.snow ? `<p class="snow">Snow: ${entry.snow} mm</p>` : ''}
      </div>
    `
      )
      .join('')}
  </div>
`

const home: JSXComponent<{ data: WeatherEntry[] }> = ({ data }) => `
  <div>
    <h2>Home</h2>
    ${data
      .map(
        (entry) => `
      <div class="weather-card">
        <p class="time">Time: ${entry.cst}</p>
        <p class="temperature">Temperature: ${entry.temp}°F</p>
        <p class="feels-like">Feels like: ${entry.feels_like}°F</p>
        <p class="description">${entry.description}</p>
        <p class="wind">Wind Speed: ${entry.wind_speed} mph</p>
        <p class="precipitation">Chance of Precipitation: ${Math.round(entry.pop * 100)}%</p>
        ${entry.rain ? `<p class="rain">Rain: ${entry.rain} mm</p>` : ''}
        ${entry.snow ? `<p class="snow">Snow: ${entry.snow} mm</p>` : ''}
      </div>
    `
      )
      .join('')}
  </div>
`

export const Main: JSXComponent<{ data: WeatherData }> = ({ data }) => `
  <!DOCTYPE html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>
    <link rel="stylesheet" href="front/styles.css" />
  </head>
  <body>
    <div class="weatherContainer">
      ${dianasWork({ data: data["Diana's work"] || [] })}
      ${kodisWork({ data: data["Kodi's work"] || [] })}
      ${home({ data: data['Home'] || [] })}
    </div>
  </body>
  </html>
`