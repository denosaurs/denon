import { DenonConfig } from "https://deno.land/x/denon@2.1.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    run: {
      cmd: "echo Hello World",
    },
  },
};

export default config;
