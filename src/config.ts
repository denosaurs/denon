// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  existsSync,
  extname,
  JSON_SCHEMA,
  log,
  parseYaml,
  readFileStr,
  readJson,
  writeJson,
  resolve,
  globToRegExp,
} from "../deps.ts";

import { WatcherConfig } from "./watcher.ts";
import { RunnerConfig } from "./runner.ts";
import { LogConfig } from "./log.ts";

import { merge } from "./merge.ts";
import { Args } from "./args.ts";

const TS_CONFIG = "denon.config.ts";

/**
 * Possible default configuration files.
 */
export const configs = [
  "denon",
  "denon.yaml",
  "denon.yml",
  "denon.json",

  ".denon",
  ".denon.yaml",
  ".denon.yml",
  ".denon.json",

  ".denonrc",
  ".denonrc.yaml",
  ".denonrc.yml",
  ".denonrc.json",

  TS_CONFIG,
];

export const reConfig = new RegExp(
  configs
    .map((_) => `**/${_}`)
    .map((_) => globToRegExp(_).source)
    .join("|"), // i know, right
);

/**
 * The denon configuration format
 */
// export interface DenonConfig extends RunnerConfig {
//   [key: string]: any;
//   watcher?: WatcherConfig;
//   logger?: LogConfig;
//   args?: Args;
// }

export type DenonConfig = RunnerConfig & Partial<CompleteDenonConfig>;

/**
 * Parameters are not optional
 */
export interface CompleteDenonConfig extends RunnerConfig {
  [key: string]: any;
  watcher: WatcherConfig;
  logger: LogConfig;
  args?: Args;
  configPath: string;
}

/** The default denon configuration */
export const DEFAULT_DENON_CONFIG: CompleteDenonConfig = {
  scripts: {},
  watcher: {
    interval: 350,
    paths: [],
    exts: ["ts", "js", "json"],
    match: ["*.*"],
    skip: ["**/.git/**"],
  },
  logger: {},
  configPath: "",
};

/**
 * Read YAML config, throws if YAML format is not valid
 */
async function readYaml(file: string): Promise<unknown> {
  const source = await readFileStr(file);
  return parseYaml(source, {
    schema: JSON_SCHEMA,
    json: true,
  });
}

/**
 * from: deno-nessie
 */
export const parsePath = (...path: string[]): string => {
  if (
    path.length === 1 &&
    (path[0]?.startsWith("http://") || path[0]?.startsWith("https://"))
  ) {
    return path[0];
  }
  return "file://" + resolve(...path);
};

/**
 * Safe import a TypeScript file
 */
async function importConfig(
  file: string,
): Promise<Partial<DenonConfig> | undefined> {
  try {
    const configRaw = await import(parsePath(file));
    return configRaw.default as Partial<DenonConfig>;
  } catch (error) {
    return;
  }
}

/**
 * Clean config from malformed strings
 */
function cleanConfig(
  config: Partial<DenonConfig>,
  file?: string,
): Partial<DenonConfig> {
  if (config.watcher && config.watcher.exts) {
    config.watcher.exts = config.watcher.exts.map((_) =>
      _.startsWith(".") ? _.substr(0) : _
    );
  }
  if (file) {
    config.configPath = resolve(file);
  }
  return config;
}

/**
 * Returns, if exists, the config filename
 */
export function getConfigFilename(): string | undefined {
  return configs.find((filename) => {
    return existsSync(filename) && Deno.statSync(filename).isFile;
  });
}

/**
 * Reads the denon config from a file
 */
export async function readConfig(
  file: string | undefined = getConfigFilename(),
): Promise<CompleteDenonConfig> {
  let config: CompleteDenonConfig = DEFAULT_DENON_CONFIG;
  if (!config.watcher.paths) config.watcher.paths = [];
  config.watcher.paths.push(Deno.cwd());

  if (file) {
    if (file === TS_CONFIG) {
      const parsed = await importConfig(TS_CONFIG);
      if (parsed) {
        config = merge(
          config,
          cleanConfig(parsed as Partial<DenonConfig>, file),
        );
      }
    } else {
      try {
        const extension = extname(file);
        if (/^\.ya?ml$/.test(extension)) {
          const parsed = await readYaml(file);
          config = merge(
            config,
            cleanConfig(parsed as Partial<DenonConfig>, file),
          );
        } else if (/^\.json$/.test(extension)) {
          const parsed = await readJson(file);
          config = merge(
            config,
            cleanConfig(parsed as Partial<DenonConfig>, file),
          );
        } else {
          try {
            const parsed = await readJson(file);
            config = merge(
              config,
              cleanConfig(parsed as Partial<DenonConfig>, file),
            );
          } catch {
            const parsed = await readYaml(file);
            config = merge(
              config,
              cleanConfig(parsed as Partial<DenonConfig>, file),
            );
          }
        }
      } catch {
        log.warning(`unsupported configuration \`${file}\``);
      }
    }
  }
  return config;
}

/**
 * Reads the denon config from a file
 */
export async function writeConfig(file: string) {
  let config = {
    "$schema": "https://deno.land/x/denon/schema.json",
    scripts: {
      "start": "app.ts",
    },
  };
  await writeJson(file, config, { spaces: 2 });
}
