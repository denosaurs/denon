import { DenonConfig } from "./mod.ts";

const config: DenonConfig = {
  scripts: {
    test: [
      {
        cmd: "deno fmt",
        desc: "format code",
      },
      {
        cmd: "deno lint --unstable",
        desc: "lint code",
      },
      {
        cmd: "deno test",
        desc: "test code",
        allow: "all",
      },
    ],
  },
  logger: {
    debug: true,
  },
};

export default config;
