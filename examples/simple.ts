import { green, red } from "https://deno.land/std/fmt/colors.ts";
import { delay } from "https://deno.land/std/async/delay.ts";

console.log(Deno.pid, green("New process, new Hello World!"));

console.log(
  Deno.pid,
  green("env.SECRET_ENV_VARIABLE:"),
  Deno.env.get("SECRET_ENV_VARIABLE"),
);

console.log(
  Deno.pid,
  green("args:"),
  Deno.args,
);

let i = 50;

while (i > 0) {
  await delay(1000);
  console.log(Deno.pid, red(`Execution #${i}!`));

  if (--i % 10 === 0) {
    throw new Error("Oh no.");
  }
}
