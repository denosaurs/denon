import { DenonConfig } from "https://deno.land/x/denon@2.1.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    test: {
      cmd: "deno test",
      desc: "run denon test",
      allow: [
        "read",
      ],
    },
  },
};

export default config;
