// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  existsSync,
  readFileStr,
  writeJson,
  readJson,
  extname,
  parseYaml,
  JSON_SCHEMA,
  log,
} from "../deps.ts";

import { WatcherConfig } from "./watcher.ts";
import { RunnerConfig } from "./runner.ts";
import { LogConfig } from "./log.ts";

import { merge } from "./merge.ts";
import { Args } from "./args.ts";

/**
 * Possible default configuration files.
 */
const configs = [
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
];

/**
 * The denon configuration format
 */
export interface DenonConfig extends RunnerConfig {
  [key: string]: any;
  watcher: WatcherConfig;
  logger: LogConfig;
  args?: Args;
}

/** The default denon configuration */
export const DEFAULT_DENON_CONFIG: DenonConfig = {
  scripts: {},
  watcher: {
    interval: 350,
    paths: [],
    exts: ["ts", "js", "json"],
    match: ["*.*"],
    skip: ["**/.git/**"],
  },
  logger: {},
};

export async function readYaml(file: string): Promise<unknown> {
  const source = await readFileStr(file);
  const parsed = parseYaml(source, {
    schema: JSON_SCHEMA,
    json: true,
  });

  return parsed;
}

export function cleanConfig(
  config: Partial<DenonConfig>,
): Partial<DenonConfig> {
  if (config.watcher?.exts) {
    config.watcher.exts = config.watcher.exts.map((_) =>
      _.startsWith(".") ? _.substr(0) : _
    );
  }
  return config;
}

/**
 * Returns, if exists, the config filename
 */
export function getConfigFilename(): string | undefined {
  return configs.find((filename) => {
    return existsSync(filename);
  });
}

/**
 * Reads the denon config from a file
 */
export async function readConfig(
  file: string | undefined = getConfigFilename(),
): Promise<DenonConfig> {
  let config: DenonConfig = DEFAULT_DENON_CONFIG;
  config.watcher.paths.push(Deno.cwd());

  if (file) {
    try {
      const extension = extname(file);
      if (/^\.ya?ml$/.test(extension)) {
        const parsed = await readYaml(file);
        config = merge(config, cleanConfig(parsed as Partial<DenonConfig>));
      } else if (/^\.json$/.test(extension)) {
        const parsed = await readJson(file);
        config = merge(config, cleanConfig(parsed as Partial<DenonConfig>));
      } else {
        try {
          const parsed = await readJson(file);
          config = merge(config, cleanConfig(parsed as Partial<DenonConfig>));
        } catch {
          const parsed = await readYaml(file);
          config = merge(config, cleanConfig(parsed as Partial<DenonConfig>));
        }
      }
    } catch {
      log.warning(`unsupported configuration \`${file}\``);
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
