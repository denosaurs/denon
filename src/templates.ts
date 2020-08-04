import { VERSION } from "../info.ts";

export interface Template {
  filename: string;
  source: string;
}

const json: Template = {
  filename: "denon.json",
  source: String.raw`{
  "$schema": "https://deno.land/x/denon/schema.json",
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "run my app.ts file"
    }
  }
}`,
};

const yaml: Template = {
  filename: "denon.yml",
  source: String.raw`scripts:
  start:
    cmd: "deno run app.ts"
    desc: "run my app.ts file"`,
};

const typescript: Template = {
  filename: "denon.config.ts",
  source: String.raw
    `import { DenonConfig } from "https://deno.land/x/denon@${VERSION}/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run app.ts",
      desc: "run my app.ts file",
    },
  },
};

export default config;`,
};

export const templates: { [key: string]: Template } = {
  "json": json,
  "yaml": yaml,
  "yml": yaml,
  "ts": typescript,
  "typescript": typescript,
};
