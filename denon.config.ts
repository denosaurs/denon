import { DenonConfig } from "./mod.ts";

const config: DenonConfig = {
  scripts: {
    test: [
      {
        cmd: "deno fmt",
        desc: "run denon format",
      },
      {
        cmd: "deno test",
        desc: "run denon format",
        allow: [
          "all",
        ],
        unstable: true,
        watch: false,
      },
    ],
  },
};

export default config;
