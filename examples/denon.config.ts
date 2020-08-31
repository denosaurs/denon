import { DenonConfig } from "../src/config.ts";

const config: DenonConfig = {
  scripts: {
    app: {
      cmd: "oak.ts",
      desc: "Run oak instance",
      allow: ["env", "net"],
      env: {
        PORT: "9001",
      },
    },
    simple: {
      cmd: "simple.ts",
      desc: "Run main app",
      allow: ["env"],
    },
  },
};

export default config;
