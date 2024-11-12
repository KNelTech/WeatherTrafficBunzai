import type { JSXComponent } from "bunzai";

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