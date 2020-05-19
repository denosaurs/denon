// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, grant } from "./deps.ts";

import { Watcher, FileEvent } from "./src/watcher.ts";
import { Runner, ExecutionEvent, Execution } from "./src/runner.ts";

import { readConfig, DenonConfig } from "./src/config.ts";
import { parseArgs } from "./src/args.ts";
import { setupLog } from "./src/log.ts";
import { timestamp } from "https://deno.land/std@0.51.0/encoding/_yaml/type/timestamp.ts";
const VERSION = "v2.0.0";

// TODO: explain permission usage in detail for transparency
const PERMISSIONS: Deno.PermissionDescriptor[] = [
  { name: "read" },
  { name: "run" },
];

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

export class Denon implements AsyncIterable<DenonEvent> {
  watcher: Watcher;
  runner: Runner;
  current?: Execution;

  constructor(private script: string, private config: DenonConfig) {
    this.watcher = new Watcher(config.watcher);
    this.runner = new Runner(config);
  }

  async *iterate(): AsyncIterator<DenonEvent> {
    this.current = this.runner.execute(this.script);
    for await (const watchE of this.watcher) {
      if (watchE.some((_) => _.type === "modify")) {
        if (this.current) {
          this.current.process.kill(Deno.Signal.SIGUSR2);
        }
        this.current = this.runner.execute(this.script);
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

if (import.meta.main) {
  await setupLog();

  const permissions = await grant(PERMISSIONS);
  if (!permissions || permissions.length < 2) {
    log.critical("Required permissions `read` and `run` not granted");
    Deno.exit(1);
  }

  const args = parseArgs(Deno.args);
  let config = await readConfig();
  await setupLog(config);

  // show help message
  if (args.help) {
    console.log("PLAIN TEXT WITH COLORS HERE");
    Deno.exit(0);
  }

  // show help message
  log.warning(VERSION);
  if (args.version) Deno.exit(0);

  if (args.cmd.length == 0) {
    console.log("CLEAR COMMAND");
    Deno.exit(0);
  }

  const script = args.cmd[0];
  const denon = new Denon(script, config);
  for await (let event of denon) {
    console.log(event);
  }
}
