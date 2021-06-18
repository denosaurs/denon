// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

import { log } from "./deps.ts";

import { FileEvent, Watcher } from "./src/watcher.ts";
import { Runner } from "./src/runner.ts";
import { Daemon } from "./src/daemon.ts";

import {
  grantPermissions,
  initializeConfig,
  printAvailableScripts,
  printHelp,
  upgrade,
} from "./src/cli.ts";
import { CompleteDenonConfig, readConfig, reConfig } from "./src/config.ts";
import { parseArgs } from "./src/args.ts";

import { BRANCH, VERSION } from "./info.ts";

const logger = log.create("main");

/** Events you can listen to when creating a `denon`
 * instance as module:
 * ```typescript
 * const denon = new Denon(config);
 * for await (const event of denon.run(script)) {
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
  const args = parseArgs(Deno.args);

  // check compatibility
  // if (!COMPAT[VERSION].includes(Deno.version.deno) && !args.upgrade) {
  //   logger.error(
  //     `Your version of denon (${VERSION}) does not support your deno version (${Deno.version.deno})`,
  //   );
  //   logger.warning(
  //     `Upgrade deno by running \`deno upgrade --version ${
  //       [...COMPAT[VERSION]].pop()
  //     }\``,
  //   );
  //   Deno.exit(1);
  // }

  await grantPermissions();

  let config = await readConfig(args.config);
  config.args = args;

  await log.setup(
    {
      filter: config.logger.quiet
        ? "ERROR"
        : config.logger.debug
        ? "DEBUG"
        : "INFO",
    },
  );

  // show version number.
  if (BRANCH !== "main") {
    logger.info(`v${VERSION}-${BRANCH}`);
  } else {
    logger.info(`v${VERSION}`);
  }
  if (args.version) Deno.exit(0);

  // update denon to latest release
  if (args.upgrade) {
    await upgrade(args.upgrade);
    Deno.exit(0);
  }

  // show help message.
  if (args.help) {
    printHelp();
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
    await printAvailableScripts(config);
    Deno.exit(0);
  }

  // const builtIn = ["run", "test", "fmt", "lint"];
  const script = args.cmd[0];

  // if (!config.scripts[script] && !builtIn.includes(script)) {
  //   const other = closest(script, Object.keys(config.scripts).concat(builtIn));
  //   logger.error(
  //     `Could not find script \`${script}\` did you mean \`${other}\`?`,
  //   );
  //   Deno.exit(1);
  // }

  const denon = new Denon(config);

  // TODO(@qu4k): events
  for await (const event of denon.run(script)) {
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
