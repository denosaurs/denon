import { exists, log, readFileStr } from "../deps.ts";

/** Possible file */
const defaults = [
  ".denon",
  ".denon.json",
  ".denonrc",
  ".denonrc.json",
  "denon.json",
];

/** The default denon configuration */
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

/** Reads the denon config from a file */
export async function readConfig(file?: string): Promise<DenonConfig> {
  if (file && !(await exists(file))) {
    log.error(`Could not find ${file}`);
  }

  if (!file) {
    for (const name of defaults) {
      if (await exists(name)) {
        file = name;
      }
    }
  }

  let json = {} as any;

  if (file) {
    json = JSON.parse(await readFileStr(file));
  }

  return { ...json } as DenonConfig;
}
