import { HelloComponent, AnotherComponent } from "../components/weatherContainer.tsx";
import type { JSXComponent, Context } from "bunzai";

export const Main: JSXComponent = () => `
  <html>
    <head>
      <link rel="stylesheet" href="/styles/styles.css" />
    </head>
    <body>
      <div>
        ${HelloComponent({ name: "Bunzai User" })}
        ${AnotherComponent({ message: "This is another component" })}
      </div>
    </body>
  </html>
`;