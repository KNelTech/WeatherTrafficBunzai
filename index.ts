import { Bunzai, type Context } from 'bunzai'
import { type JSXComponent, jsxPlugin, staticPlugin } from 'bunzai/plugins'
import { WeatherService, Main } from './myMiddleware/WeatherService'

const weatherService = new WeatherService()

new Bunzai( { errorHandler: true } )
  .plugin(jsxPlugin())
  .plugin(staticPlugin('/front', 'front'))
  .get('/api/display-weather', async (c: Context) => {
    try {
      const data = await WeatherService.fetchAllWeatherData()
      weatherService.updateWeatherData(data)
      return c.json(data as any)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      return c.json({ error: 'Failed to fetch weather data' }, { status: 500 })
    }
  })
  .get('/', async (c: Context) => {
    try {
      const data = await WeatherService.fetchAllWeatherData()
      weatherService.updateWeatherData(data)
      return c.jsx(Main, { data })
    } catch (error) {
      console.error('Error rendering main page:', error)
      return c.text('Error rendering page', { status: 500 })
    }
  })
  .listen()
  .then(() => {
    console.log('Server started on http://localhost:3000')
  })
