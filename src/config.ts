// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  existsSync,
  extname,
  JSON_SCHEMA,
  parseYaml,
  readJson,
  resolve,
  globToRegExp,
  log,
} from "../deps.ts";

import { WatcherConfig } from "./watcher.ts";
import { RunnerConfig } from "./runner.ts";

import { merge } from "./merge.ts";
import { Args } from "./args.ts";
import { Template } from "./templates.ts";

const logger = log.create("conf");

/** Possible default configuration files. */
export const configs = [
  "denon.yaml",
  "denon.yml",
  "denon.json",

  "scripts.json",
  "scripts.yml",
  "scripts.yaml",

  "denon.config.ts",
  "scripts.config.ts",
  "denon.config.js",
  "scripts.config.js",
];

export const reConfig = new RegExp(
  configs
    .map((_) => `**/${_}`)
    .map((_) => globToRegExp(_).source)
    .join("|"), // i know, right
);

export type DenonConfig = RunnerConfig & Partial<CompleteDenonConfig>;

/** Parameters are not optional */
export interface CompleteDenonConfig extends RunnerConfig {
  [key: string]: unknown;
  watcher: WatcherConfig;
  args?: Args;
  configPath: string;
}

/** The default denon configuration */
export const DEFAULT_DENON_CONFIG: CompleteDenonConfig = {
  scripts: {},
  watcher: {
    interval: 350,
    paths: [],
    exts: ["ts", "tsx", "js", "jsx", "json"],
    match: ["*.*"],
    skip: ["**/.git/**"],
  },
  watch: true,
  logger: {},
  configPath: "",
};

/** Read YAML config, throws if YAML format is not valid */
async function readYaml(file: string): Promise<unknown> {
  const source = await Deno.readTextFile(file);
  return parseYaml(source, {
    schema: JSON_SCHEMA,
    json: true,
  });
}

/** Safe import a TypeScript file */
async function importConfig(
  file: string,
): Promise<Partial<DenonConfig> | undefined> {
  try {
    const configRaw = await import(`file://${resolve(file)}`);
    return configRaw.default as Partial<DenonConfig>;
  } catch (error) {
    logger.error(error.message ?? "Error opening ts config config");
    return;
  }
}

/** Clean config from malformed strings */
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

/** Returns, if exists, the config filename */
export function getConfigFilename(): string | undefined {
  return configs.find((filename) => {
    return existsSync(filename) && Deno.statSync(filename).isFile;
  });
}

/** Reads the denon config from a file */
export async function readConfig(
  file: string | undefined = getConfigFilename(),
): Promise<CompleteDenonConfig> {
  let config: CompleteDenonConfig = DEFAULT_DENON_CONFIG;
  if (!config.watcher.paths) config.watcher.paths = [];
  config.watcher.paths.push(Deno.cwd());

  if (file) {
    if (file.endsWith("config.js") || file.endsWith("config.ts")) {
      const parsed = await importConfig(file);
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
        logger.warning(`unsupported configuration \`${file}\``);
      }
    }
  }
  return config;
}

/** Reads the denon config from a file */
export async function writeConfigTemplate(template: Template): Promise<void> {
  try {
    logger.info(`writing template to \`${template.filename}\``);
    await Deno.writeTextFile(
      resolve(Deno.cwd(), template.filename),
      template.source,
    );
    logger.info(
      `\`${template.filename}\` created in current working directory`,
    );
  } catch (e) {
    logger.error(
      `\`${template.filename}\` cannot be saved in current working directory`,
    );
  }
}
