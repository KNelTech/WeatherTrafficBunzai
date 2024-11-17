import type { Context, Middleware, JSXComponent } from '../core/types'
import os from 'node:os'

const convertMS = (ms: number): string => {
  const units = [
    { value: 86400000, name: 'day' },
    { value: 3600000, name: 'hour' },
    { value: 60000, name: 'minute' },
    { value: 1000, name: 'second' }
  ]

  const parts = units.reduce((acc, { value, name }) => {
    const count = Math.floor(ms / value)
    if (count) {
      acc.push(`${count} ${name}${count > 1 ? 's' : ''}`)
      ms %= value
    }
    return acc
  }, [] as string[])

  return parts.length ? parts.join(' ') : 'less than 1 second'
}

const formatDataSize = (bytes: number): string => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'] as const
  const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

interface HealthResponse {
  [key: string]: unknown
  status: 'OK' | 'ERROR'
  uptime: string
  memory: {
    total: string
    used: string
    rss: string
    free: string
  }
  cpu: {
    model: string
    cores: number
    usage: number
  }
  os: {
    type: string
    platform: string
    release: string
    arch: string
  }
  network: {
    hostname: string
    interfaces: { [key: string]: os.NetworkInterfaceInfo[] }
  }
  bunVersion: string
  timestamp: string
  responseTime: string
  message?: string
  error?: string
}

class HealthCheckService {
  static getCPUInfo(): { model: string; cores: number; usage: number } {
    const cpus: os.CpuInfo[] = os.cpus()
    const totalIdle: number = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0)
    const totalTick: number = cpus.reduce(
      (acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b),
      0
    )
    const usage: number = parseFloat(((1 - totalIdle / totalTick) * 100).toFixed(2))

    return {
      model: cpus[0].model,
      cores: cpus.length,
      usage
    }
  }

  static getOSInfo(): {
    type: string
    platform: string
    release: string
    arch: string
  } {
    return {
      type: os.type() as string,
      platform: os.platform() as string,
      release: os.release() as string,
      arch: os.arch() as string
    }
  }

  static getNetworkInfo(): {
    hostname: string
    interfaces: { [key: string]: os.NetworkInterfaceInfo[] }
  } {
    const interfaces = os.networkInterfaces() as { [key: string]: os.NetworkInterfaceInfo[] }
    const safeInterfaces: { [key: string]: os.NetworkInterfaceInfo[] } = {}

    for (const [key, value] of Object.entries(interfaces)) {
      if (value) {
        safeInterfaces[key] = value
      }
    }

    return {
      hostname: os.hostname(),
      interfaces: safeInterfaces
    }
  }

  static getUptime(): string {
    return convertMS(process.uptime() * 1000)
  }

  static getMemoryUsage(): { total: string; used: string; rss: string } {
    const { heapTotal, heapUsed, rss } = process.memoryUsage() as {
      heapTotal: number
      heapUsed: number
      rss: number
    }
    return {
      total: formatDataSize(heapTotal),
      used: formatDataSize(heapUsed),
      rss: formatDataSize(rss)
    }
  }

  static getResponseTime(startTime: [number, number]): string {
    const [seconds, nanoseconds] = process.hrtime(startTime)
    return `${(seconds * 1000 + nanoseconds / 1e6).toFixed(3)}`
  }

  static buildResponse(
    status: 'OK' | 'ERROR',
    responseTime: string,
    uptime: string,
    memory: { total: string; used: string; rss: string; free: string },
    message?: string,
    error?: string
  ): HealthResponse {
    return {
      status,
      uptime,
      memory,
      cpu: this.getCPUInfo(),
      os: this.getOSInfo(),
      network: this.getNetworkInfo(),
      bunVersion: Bun.version,
      timestamp: new Date().toLocaleString(),
      responseTime: `${responseTime} ms`,
      message,
      error
    }
  }
}

const styles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #e0e0e0;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #121212;
    }
    .container {
      background-color: #1e1e1e;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    h1 { color: #bb86fc; border-bottom: 2px solid #3700b3; padding-bottom: 10px; }
    h2 { color: #03dac6; margin-bottom: 10px; }
    .status { font-size: 1.2em; font-weight: bold; }
    .info-group { margin-bottom: 20px; }
    .info-item {
      background-color: #2e2e2e;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .memory-list { list-style-type: none; padding-left: 0; }
    .memory-list li { margin-bottom: 5px; }
    .error {
      background-color: #3d1c1c;
      border-left: 5px solid #cf6679;
      padding: 10px;
      margin-top: 20px;
    }
    strong { color: #bb86fc; }
  </style>
`

const InfoItem = (title: string, content: string) => `
  <p><strong>${title}:</strong> ${content}</p>
`

const InfoGroup = (title: string, content: string) => `
  <div class="info-group">
    <h2>${title}</h2>
    <div class="info-item">
      ${content}
    </div>
  </div>
`

const MemoryUsage = (memory: HealthResponse['memory']) => `
  <ul class="memory-list">
    ${Object.entries(memory)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('')}
  </ul>
`

const NetworkInterfaces = (interfaces: HealthResponse['network']['interfaces']) => `
  ${Object.entries(interfaces)
    .map(
      ([name, ifaces]) => `
    <h4>${name}</h4>
    ${ifaces
      .map(
        (iface) => `
      <p>Address: ${iface.address}, Family: ${iface.family}, MAC: ${iface.mac}</p>
    `
      )
      .join('')}
  `
    )
    .join('')}
`

const HealthCheck: JSXComponent<HealthResponse> = (props) => {
  const statusColor = props.status === 'OK' ? '#4CAF50' : '#F44336'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Health Check</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>Health Check</h1>
        ${InfoGroup('Status', `<p class="status" style="color: ${statusColor}">${props.status}</p>`)}
        ${InfoGroup(
          'System Information',
          `
          ${InfoItem('Uptime', props.uptime)}
          ${InfoItem('Timestamp', props.timestamp)}
          ${InfoItem('Response Time', props.responseTime)}
        `
        )}
        ${InfoGroup('Memory Usage', MemoryUsage(props.memory))}
        ${InfoGroup(
          'CPU Information',
          `
          ${InfoItem('Model', props.cpu.model)}
          ${InfoItem('Cores', props.cpu.cores.toString())}
          ${InfoItem('Usage', `${props.cpu.usage}%`)}
        `
        )}
        ${InfoGroup(
          'Operating System',
          `
          ${InfoItem('Type', props.os.type)}
          ${InfoItem('Platform', props.os.platform)}
          ${InfoItem('Release', props.os.release)}
          ${InfoItem('Architecture', props.os.arch)}
        `
        )}
        ${InfoGroup(
          'Network',
          `
          ${InfoItem('Hostname', props.network.hostname)}
          <h3>Network Interfaces:</h3>
          ${NetworkInterfaces(props.network.interfaces)}
        `
        )}
        ${InfoGroup('Bun Version', props.bunVersion)}
        ${props.message ? InfoGroup('Message', props.message) : ''}
        ${
          props.error
            ? `
          <div class="error">
            <h2>Error</h2>
            <p>${props.error}</p>
          </div>
        `
            : ''
        }
      </div>
    </body>
    </html>
  `
}

const Health: Middleware = async (c: Context) => {
  const startTime = process.hrtime()
  try {
    const [uptime, memoryUsage] = await Promise.all([
      HealthCheckService.getUptime(),
      HealthCheckService.getMemoryUsage()
    ])
    const memory = {
      ...memoryUsage,
      free: formatDataSize(os.freemem())
    }
    const responseTime = HealthCheckService.getResponseTime(startTime)
    const response = HealthCheckService.buildResponse('OK', responseTime, uptime, memory)

    c.setHeader('Server-Timing', `total;dur=${responseTime}`)

    return c.jsx(HealthCheck, response)
  } catch (error: unknown) {
    const responseTime = HealthCheckService.getResponseTime(startTime)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorResponse = HealthCheckService.buildResponse(
      'ERROR',
      responseTime,
      HealthCheckService.getUptime(),
      {
        ...HealthCheckService.getMemoryUsage(),
        free: formatDataSize(os.freemem())
      },
      'Health check failed',
      errorMessage
    )

    return c.jsx(HealthCheck, errorResponse)
  }
}

export { Health }
