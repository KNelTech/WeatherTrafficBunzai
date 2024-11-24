
import type { JSXComponent, Context } from "bunzai";


interface WeatherEntry {
  cst: string
  temp: number
  feels_like: number
  description: string
  wind_speed: number
  pop: number
  rain?: number
  snow?: number
}

interface WeatherData {
  [location: string]: WeatherEntry[]
}

class WeatherService {
  public dianasWork: WeatherEntry[] = []
  public kodisWork: WeatherEntry[] = []
  public home: WeatherEntry[] = []


  
  static async fetchWeatherData(): Promise<WeatherData> {
    const response = await fetch('/api/display-weather')
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    const data: WeatherData = await response.json()
    return data
  }

  updateWeatherData(data: WeatherData): void {
    this.dianasWork = data["Diana's work"] || []
    this.kodisWork = data["Kodi's work"] || []
    this.home = data['Home'] || []
  }
}

const weatherService = new WeatherService()

const dianasWork: JSXComponent<{ data: WeatherEntry[] }> = ({ data }) => `
  <div>
    <h2>Diana's Work</h2>
    ${data
      .map(
        (entry) => `
      <div>
        <p>Time: ${entry.cst}</p>
        <p>Temperature: ${entry.temp}°C</p>
        <p>Feels like: ${entry.feels_like}°C</p>
        <p>Description: ${entry.description}</p>
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
      <div>
        <p>Time: ${entry.cst}</p>
        <p>Temperature: ${entry.temp}°C</p>
        <p>Feels like: ${entry.feels_like}°C</p>
        <p>Description: ${entry.description}</p>
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
      <div>
        <p>Time: ${entry.cst}</p>
        <p>Temperature: ${entry.temp}°C</p>
        <p>Feels like: ${entry.feels_like}°C</p>
        <p>Description: ${entry.description}</p>
      </div>
    `
      )
      .join('')}
  </div>
`

const Main: JSXComponent<{ data: WeatherData }> = ({ data }) => `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>
    <link rel="stylesheet" href="/styles/styles.css" />
  </head>
  <body>
    <div>
      ${dianasWork({ data: data["Diana's work"] || [] })}
      ${kodisWork({ data: data["Kodi's work"] || [] })}
      ${home({ data: data['Home'] || [] })}
    </div>
  </body>
  </html>
`

export { WeatherService, Main }