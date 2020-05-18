// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, grant } from "./deps.ts";

import { Watcher, WatcherEvent } from "./src/watcher.ts";
import { readConfig, DenonConfig } from "./src/config.ts";
import { parseArgs } from "./src/args.ts";
import { setupLog } from "./src/log.ts";

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
  change: WatcherEvent[];
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

  constructor(private config?: DenonConfig) {
    this.watcher = new Watcher(config);
  }

  async *iterate(): AsyncIterator<DenonEvent> {
    for await (const events of this.watcher) {
      console.log("DENON CLASS", events);
    }
    yield {
      type: "success",
      status: {
        code: 0,
        success: true,
      },
    };
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

  log.debug("Required permissions `read` and `run` granted");

  const args = parseArgs(Deno.args);
  let config = await readConfig(args);
  await setupLog(config);

  // show help message
  if (args.help) {
    console.log("PLAIN TEXT WITH COLORS HERE");
    Deno.exit(0);
  }

  log.warning(VERSION);
  if (args.version) Deno.exit(0);

  const denon = new Denon({
    legacy: false,
    exe: {
      "ts": ["deno", "run", "${exe-args}", "${file}"],
    },
    file: "ciao",
    quiet: false,
    debug: false,
    fullscreen: true,
  });
  for await (let event of denon) {
    console.log(event);
  }
}
