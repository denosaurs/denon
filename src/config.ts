// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  existsSync,
  readFileStr,
  readJson,
  extname,
  parseYaml,
  JSON_SCHEMA,
  log,
} from "../deps.ts";

import { DenonEventType } from "../denon.ts";

import { WatcherConfig } from "./watcher.ts";
import { RunnerConfig } from "./runner.ts";
import { LogConfig } from "./log.ts";

import { merge } from "./merge.ts";

/**
 * Possible defualt configuration files.
 */
const configs = [
  "denon.yaml",
  "denon.yml",
  "denon.json",
  ".denon.yaml",
  ".denon.yml",
  ".denon.json",
  ".denonrc.yaml",
  ".denonrc.yml",
  ".denonrc.json",
];

/**
 * The denon configuration format
 */
export interface DenonConfig extends RunnerConfig {
  [key: string]: any;
  watcher: WatcherConfig;
  logger: LogConfig;
}

export interface DenonConfigLegacy {
  /**
   * Map denon events to executeable(s)
   */
  events: { [event in DenonEventType]?: string | string[] };

  // Running
  /**
   * Map extensions to executeable(s)
   */
  execute: { [extension: string]: string | string[] };
  /**
   * Enviornment to pass to the child process
   */
  env: { [key: string]: string };
  /**
   * Arguments to pass to the child process
   */
  args: string[];

  // Deno specific
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
export const DEFAULT_DENON_CONFIG: DenonConfig = {
  scripts: {},
  watcher: {
    interval: 350,
    paths: [Deno.cwd()],
  },
  logger: {},
};

/**
 * Reads the denon config from a file
 * @param args cli args from parseArgs()
 * */
export async function readConfig(): Promise<DenonConfig> {
  let config: DenonConfig = DEFAULT_DENON_CONFIG;

  let file = configs.find((filename) => {
    return existsSync(filename);
  });

  if (file) {
    try {
      const extension = extname(file);
      if (/^ya?ml$/.test(extension)) {
        const source = await readFileStr(file);
        const parsed = parseYaml(source, {
          schema: JSON_SCHEMA,
          json: true,
        });
        config = merge(config, parsed);
      } else if (/^json$/.test(extension)) {
        const parsed = readJson(file);
        config = merge(config, parsed);
      }
    } catch (e) {
      log.warning(`unsupported configuration \`${file}\``);
    }
  }

  return config;
}
