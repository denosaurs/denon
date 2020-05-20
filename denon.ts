// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, grant } from "./deps.ts";

import { Watcher, FileEvent } from "./src/watcher.ts";
import { Runner, Execution } from "./src/runner.ts";

import { readConfig, writeConfig, DenonConfig } from "./src/config.ts";
import { parseArgs } from "./src/args.ts";
import { setupLog } from "./src/log.ts";

const VERSION = "v2.0.0";

/**
 * These are the permissions required for a clean run
 * of `denon`. If not provided through installation they 
 * will be asked on every run by the `grant()` std function.
 * 
 * The permissions required are:
 * - *read*, used to correctly load a configuration file and
 * to monitor for filesystem changes in the directory `denon`
 * is executed to reload scripts.
 * - *run*, used to run scripts as child processes.
 */
const PERMISSIONS: Deno.PermissionDescriptor[] = [
  { name: "read" },
  { name: "run" },
];

const PERMISSION_OPTIONAL: { [key: string]: Deno.PermissionDescriptor[] } = {
  write: [{ name: "write" }],
};

/**
 * 
 */
export declare type DenonEventType =
  | "start"
  | "reload"
  | "crash"
  | "success"
  | "exit";

export declare type DenonEvent =
  | DenonReloadEvent
  | DenonCrashEvent
  | DenonSuccessEvent
  | DenonExitEvent;

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

export class Daemon implements AsyncIterable<DenonEvent> {
  private current?: Execution;
  constructor(private denon: Denon, private script: string) {}

  async *iterate(): AsyncIterator<DenonEvent> {
    this.current = this.denon.runner.execute(this.script);
    for await (const watchE of this.denon.watcher) {
      if (watchE.some((_) => _.type === "modify")) {
        if (this.current) {
          this.current.process.kill(Deno.Signal.SIGUSR2);
        }
        this.current = this.denon.runner.execute(this.script);
      }
      if (this.current) {
        for await (const exeE of this.current) {
          if (exeE.type == "alive") break;
          if (exeE.type == "status") {
            if (exeE.status.success) {
              log.info("clean exit - waiting for changes before restart");
            } else {
              log.info(
                "app crashed - waiting for file changes before starting ...",
              );
            }
            this.current = undefined;
            break;
          }
        }
      }
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<DenonEvent> {
    return this.iterate();
  }
}

export class Denon {
  watcher: Watcher;
  runner: Runner;

  constructor(config: DenonConfig) {
    this.watcher = new Watcher(config.watcher);
    this.runner = new Runner(config);
  }

  run(script: string): AsyncIterable<DenonEvent> {
    return new Daemon(this, script);
  }
}

if (import.meta.main) {
  await setupLog();
  let permissions = await grant(PERMISSIONS);
  if (!permissions || permissions.length < 2) {
    log.critical("Required permissions `read` and `run` not granted");
    Deno.exit(1);
  }

  const args = parseArgs(Deno.args);
  const config = await readConfig();
  await setupLog(config);

  config.args = args;

  // show help message
  if (args.help) {
    console.log("PLAIN TEXT WITH COLORS HERE");
    Deno.exit(0);
  }

  // show version nunber
  log.warning(VERSION);
  if (args.version) Deno.exit(0);

  if (args.init) {
    let permissions = await grant(PERMISSION_OPTIONAL.write);
    if (!permissions || permissions.length < 1) {
      log.critical("Required permissions `write` not granted");
      Deno.exit(1);
    }
    await writeConfig();
    log.info("configuration created correctly");
    Deno.exit(0);
  }

  if (args.cmd.length == 0) {
    console.log("CLEAR COMMAND");
    Deno.exit(0);
  }

  const script = args.cmd[0];
  const denon = new Denon(config);

  for await (let event of denon.run(script)) {
    console.log(event);
  }
}
