import { weatherContainer, AnotherComponent } from "../components/weatherContainer.tsx";
import type { JSXComponent, Context } from "bunzai";

export const Main: JSXComponent = () => `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>
      <link rel="stylesheet" href="/styles/styles.css" />
    </head>
    <body>
      <div>
        ${weatherContainer({ name: "Dick head..." })}
        ${AnotherComponent({ message: "Why are we still awake?" })}
      </div>
    </body>
  </html>
`;