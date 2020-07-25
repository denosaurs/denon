// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { Watcher, FileEvent } from "./src/watcher.ts";
import { Runner } from "./src/runner.ts";
import { Daemon } from "./src/daemon.ts";

import {
  printAvailableScripts,
  printHelp,
  initializeConfig,
  grantPermissions,
  upgrade,
  autocomplete,
} from "./src/cli.ts";
import { readConfig, CompleteDenonConfig, reConfig } from "./src/config.ts";
import { parseArgs } from "./src/args.ts";
import log from "./src/log.ts";

export const VERSION = "v2.3.0";
export const BRANCH = "dev";

const logger = log.prefix("main");

/** Events you can listen to when creating a `denon`
 * instance as module:
 * ```typescript
 * const denon = new Denon(config);
 * for await (let event of denon.run(script)) {
 *   // event handling here
 * }
 * ``` */
export declare type DenonEventType =
  | "start"
  | "reload"
  | "crash"
  | "success"
  | "exit";

export declare type DenonEvent =
  | DenonStartEvent
  | DenonReloadEvent
  | DenonCrashEvent
  | DenonSuccessEvent
  | DenonExitEvent;

export declare interface DenonStartEvent {
  type: "start";
}

export declare interface DenonReloadEvent {
  type: "reload";
  change: FileEvent[];
}

export declare interface DenonCrashEvent {
  type: "crash";
  status: Deno.ProcessStatus;
}

export declare interface DenonSuccessEvent {
  type: "success";
  status: Deno.ProcessStatus;
}

export declare interface DenonExitEvent {
  type: "exit";
}

/** Denon instance.
 * Holds loaded configuration and handles creation
 * of daemons with the `start(script)` method. */
export class Denon {
  watcher: Watcher;
  runner: Runner;

  constructor(public config: CompleteDenonConfig) {
    this.watcher = new Watcher(config.watcher);
    this.runner = new Runner(config, config.args ? config.args.cmd : []);
  }

  run(script: string): AsyncIterable<DenonEvent> {
    return new Daemon(this, script);
  }
}

/** CLI starts here,
 * other than the awesome `denon` cli this is an
 * example on how the library could be used if
 * included as a module. */
if (import.meta.main) {
  await log.setup();

  await grantPermissions();

  const args = parseArgs(Deno.args);
  let config = await readConfig(args.config);
  await log.setup(config.logger);

  autocomplete(config);

  config.args = args;

  // show help message.
  if (args.help) {
    printHelp(VERSION);
    Deno.exit(0);
  }

  // show version number.
  logger.info(`${VERSION}-${BRANCH}`);
  if (args.version) Deno.exit(0);

  // update denon to latest release
  if (args.upgrade) {
    await upgrade(args.upgrade);
    Deno.exit(0);
  }

  // create configuration file.
  // TODO(@qu4k): should be made interactive.
  if (args.init) {
    await initializeConfig(args.init);
    Deno.exit(0);
  }

  // show all available scripts.
  if (args.cmd.length === 0) {
    printAvailableScripts(config);
    Deno.exit(0);
  }

  const script = args.cmd[0];
  const denon = new Denon(config);

  if (config.logger.fullscreen) console.clear();

  const conf = log.prefix("conf");
  if (config.watcher.match) {
    conf.info(`watching path(s): ${config.watcher.match.join(" ")}`);
  }
  if (config.watcher.exts) {
    conf.info(`watching extensions: ${config.watcher.exts.join(",")}`);
  }

  // TODO(@qu4k): events
  for await (let event of denon.run(script)) {
    if (event.type === "reload") {
      if (
        event.change.some(
          (_) => reConfig.test(_.path) && _.path === config.configPath,
        )
      ) {
        config = await readConfig(args.config);
        logger.debug("reloading config");
      }
    }
  }
}
