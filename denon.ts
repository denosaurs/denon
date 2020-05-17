import { log } from "./deps.ts";

import { FileChange } from "./src/watcher.ts";
import { DenonConfig } from "./src/config.ts";
import { setupLog } from "./src/log.ts";

export type DenonEventType =
  | "start"
  | "reload"
  | "crash"
  | "success"
  | "exit";

export interface DenonEvent {
  type: DenonEventType;
}

export interface DenonReloadEvent extends DenonEvent {
  type: "reload";
  change: FileChange[];
}

export class Denon implements AsyncIterable<DenonEvent> {
  async *iterate(): AsyncIterator<DenonEvent> {
    while (true) {
      yield {
        type: "success",
      };
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<DenonEvent> {
    return this.iterate();
  }
}

export async function denon(config: DenonConfig) {
  await setupLog(config);
}

if (import.meta.main) {
  await denon({
    files: [],
    quiet: false,
    debug: false,
    fullscreen: false,
    extensions: [],
    match: [],
    skip: [],
    interval: 400,
    watch: [],
    deno_args: [],
    execute: {},
    fmt: false,
    test: false,
  });
}
