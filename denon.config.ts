import { DenonConfig } from "./mod.ts";

const config: DenonConfig = {
  scripts: {
    test: [
      {
        cmd: "deno fmt --check",
        desc: "format code",
      },
      {
        cmd: "deno lint",
        desc: "lint code",
        unstable: true,
      },
      {
        cmd: "deno test",
        desc: "test code",
        allow: "all",
        unstable: true,
      },
    ],
  },
  logger: {
    debug: false,
  },
};

export default config;
