import {
  exists,
  log,
  readFileStr,
  extname,
  parseYaml,
  JSON_SCHEMA,
} from "../deps.ts";

import { DenonEventType } from "../denon.ts";
import { Args } from "./args.ts";

/**
 * Possible defualt configuration files
 */
const defaults = [
  "denon.json",
  "denon.yaml",
  ".denon",
  ".denon.json",
  ".denon.yaml",
  ".denonrc",
  ".denonrc.json",
  ".denonrc.yaml",
];

/**
 * The denon configuration format
 */
export interface DenonConfig {
  // make indexable
  [key: string]: any;

  // Logging
  /**
   * Disables logging
   */
  quiet: boolean;
  /**
   * Enables debugging
   */
  debug: boolean;
  /**
   * Clear the console on reload events
   */
  fullscreen: boolean;

  // Watching
  /**
   * Interval to debounce multiple watcher firings with
   */
  interval: number;
  /**
   * Array of file extensions to watch for
   */
  extensions: string[];
  /**
   * An array of glob patterns to watch for
   */
  watch: string[];
  /**
   * An array of glob patterns to not watch for
   */
  skip: string[];

  /**
   * Map denon events to executeables
   */
  events: { [event in DenonEventType]?: string[] };

  // Running
  /**
   * Map extensions to executeables
   * */
  execute: { [extension: string]: string[] };
  /**
   * Enviornment to pass to the child process
   * */
  env: { [key: string]: string };
  /**
   * Arguments to pass to the child process
   * */
  args: string[];

  // Deno specific
  /**
   * Arguments that should be passed to deno
   * such as permissions, --importmap or --lock
   */
  denoArgs: string[];
  /**
   * Enables deno format on reload if true and if specified only on the array of paths 
   */
  fmt: boolean | string[];
  /** 
   * Enables deno test if true and if specified only on the array of globs
   */
  test: boolean | string[];
}

/** The default denon configuration */
export const DefaultDenonConfig: DenonConfig = {
  quiet: false,
  debug: false,
  fullscreen: false,

  interval: 500,
  extensions: ["js", "ts", "json"],
  watch: ["*.*"],
  skip: [],

  events: {},

  execute: {
    "ts": ["deno", "run"],
    "js": ["deno", "run"],
  },
  env: {},
  args: [],

  denoArgs: [],
  fmt: false,
  test: false,
};

/**
 * Reimplementation of Object.assign() that discards
 * `undefined` values.
 * @param target to witch assing
 * @param sources to witch copy from
 */
function mergeConfig(target: DenonConfig, ...sources: any): DenonConfig {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        target[key] = val;
      }
    }
  }
  return target;
}

/**
 * Reads the denon config from a file
 * @param args cli args from parseArgs()
 * */
export async function readConfig(
  args?: Args,
): Promise<DenonConfig> {
  let file = args?.config ?? undefined;
  let config: DenonConfig = DefaultDenonConfig;

  if (file && !(await exists(file))) {
    log.error(`Could not find ${file}`);
  }

  if (!file) {
    for (const name of defaults) {
      if (await exists(name)) {
        if (file) {
          log.warning("Multiple config files found, using:", file);
          break;
        }

        file = name;
      }
    }
  }

  if (file) {
    const extension = extname(file);
    const source = await readFileStr(file);
    let configFile;

    if (extension === "json") {
      try {
        configFile = await JSON.parse(source);
      } catch (err) {
        log.error("Could not parse json config: ", err.message);
      }
    } else if (extension === "yaml") {
      try {
        configFile = parseYaml(source, {
          schema: JSON_SCHEMA,
          json: true,
        });
      } catch (err) {
        log.error("Could not parse yaml config: ", err.message);
      }
    } else {
      try {
        configFile = await JSON.parse(source);
      } catch {
        try {
          configFile = parseYaml(source, {
            schema: JSON_SCHEMA,
            json: true,
          });
        } catch {
          log.error("Could not parse json/yaml config");
        }
      }
    }

    if (configFile) {
      config = mergeConfig(config, configFile, args);
    } else {
      config = mergeConfig(config, args);
    }
  }

  return config;
}
