import { exists, readFileStr } from "./deps.ts";
import { fail } from "./log.ts";

export interface DenonConfig {
  files: string[];
  quiet: boolean;
  debug: boolean;
  fullscreen: boolean;
  extensions: string[] | undefined;
  match: string[] | undefined;
  skip: string[] | undefined;
  interval: number;
  watch: string[];
  deno_args: string[];
  execute: { [extension: string]: string[] };
  fmt: boolean;
  test: boolean;
}

export const DenonConfigDefaults: DenonConfig = {
  files: [],
  quiet: false,
  debug: false,
  fullscreen: false,
  extensions: undefined,
  match: undefined,
  skip: undefined,
  interval: 500,
  watch: [],
  deno_args: [],
  execute: {
    ".js": ["deno", "run"],
    ".ts": ["deno", "run"],
  },
  fmt: false,
  test: false,
};

export async function readConfig(file?: string): Promise<DenonConfig> {
  if (file && !(await exists(file))) {
    fail(`Could not find ${file}`);
  }

  if (!file) {
    if (await exists(".denon")) {
      file = ".denon";
    } else if (await exists(".denon.json")) {
      file = ".denon.json";
    } else if (await exists(".denonrc")) {
      file = ".denonrc";
    } else if (await exists(".denonrc.json")) {
      file = ".denonrc.json";
    }
  }

  let json = {} as any;

  if (file) {
    json = JSON.parse(await readFileStr(file));
  }

  return { ...DenonConfigDefaults, ...json };
}
