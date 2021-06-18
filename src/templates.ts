// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

import { VERSION } from "../info.ts";

// deno-lint-ignore-file

export interface Template {
  filename: string;
  source: string;
}

const json: Template = {
  filename: "scripts.json",
  source: String.raw`{
  "$schema": "https://deno.land/x/denon@${VERSION}/schema.json",
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "run my app.ts file"
    }
  }
}`,
};

const yaml: Template = {
  filename: "scripts.yml",
  source: String.raw`scripts:
  start:
    cmd: "deno run app.ts"
    desc: "run my app.ts file"`,
};

const typescript: Template = {
  filename: "scripts.config.ts",
  source: String.raw`
import { DenonConfig } from "https://deno.land/x/denon@${VERSION}/mod.ts";

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
  json: json,
  yaml: yaml,
  yml: yaml,
  ts: typescript,
  typescript: typescript,
};
