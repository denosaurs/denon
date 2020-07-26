import { DenonConfig } from "https://deno.land/x/denon/mod.ts";
import { config as env_config } from "https://deno.land/x/dotenv/mod.ts";

const config: DenonConfig = {
  scripts: {
    run: {
      cmd: "simple.ts",
      desc: "Run main app",
      allow: ["env"],
    },
    oak: {
      cmd: "oak.ts",
      desc: "Run oak instance",
      allow: ["env", "net"],
      env: {
        PORT: "9001",
      },
    },
  },
  logger: {
    debug: true,
  },
  watcher: {
    exts: ["ts", "json", "ini"],
    skip: ["super_duper_secret/*"],
  },
  env: env_config(),
};

export default config;
