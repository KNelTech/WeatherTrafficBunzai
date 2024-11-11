import { Bunzai, Logger } from "bunzai";
import type { JSXComponent, Context, Next, Middleware } from "bunzai";
import { Main } from "./front/pages/main.tsx";

const app = new Bunzai();

// Serve static files from the 'front/styles' directory
app.static("/styles", "front/styles");

app.use(Logger());

app.get("/", (c: Context) => {
  return c.jsx(Main, null);
});

app.listen().then(() => {
  console.log("Server running on http://localhost:3000");
});