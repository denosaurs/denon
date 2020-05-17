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
  // make iterable
  [key: string]: any;

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

/**
 * Reimplementation of Object.assign() that discards
 * `undefined` values.
 * @param target to witch assing
 * @param sources to witch copy from
 */
const mergeConfig = (target: DenonConfig, ...sources: any): DenonConfig => {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        target[key] = val;
      }
    }
  }
  return target;
};

/** Reads the denon config from a file */
export async function readConfig(
  file?: string,
  args?: any,
): Promise<DenonConfig> {
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
