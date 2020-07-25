import { DenonConfig } from "./mod.ts";

const config: DenonConfig = {
  scripts: {
    test: [
      {
        cmd: "deno fmt",
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
  watcher: {
    legacy: true,
  },
};

export default config;
