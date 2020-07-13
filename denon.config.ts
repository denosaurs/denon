import { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    test: {
      cmd: "deno test",
      desc: "run denon test",
      allow: [
        "read",
      ],
      unstable: true,
    },
  },
};

export default config;
