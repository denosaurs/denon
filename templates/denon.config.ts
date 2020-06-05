import { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    hello: {
      cmd: "echo Hello World from denon.confing.ts",
      desc: "greet the world",
    },
  },
};

export default config;
