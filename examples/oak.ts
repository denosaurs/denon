import { Application } from "https://deno.land/x/oak/mod.ts";
import { green } from "https://deno.land/std/fmt/colors.ts";

const app = new Application();

let PORT = 8000;

let port = Deno.env.get("PORT");
if (port) {
  PORT = Number.parseInt(port);
}

app.use((ctx) => {
  ctx.response.body = "Hello Denon!";
});

console.log("Listening to", green(`:${PORT}`));

await app.listen({ port: PORT });
