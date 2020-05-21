// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log } from "../deps.ts";

import { Denon, DenonEvent } from "../denon.ts";
import { DenonConfig } from "./config.ts";
import { Execution } from "./runner.ts";

/**
 * Daemon instance. 
 * Returned by Denon instance when
 * `start(script)` is called. It can be used in a for
 * loop to listen to DenonEvents.
 */
export class Daemon implements AsyncIterable<DenonEvent> {
  #denon: Denon;
  #script: string;
  #current?: Execution;
  #config: DenonConfig;

  constructor(denon: Denon, script: string) {
    this.#denon = denon;
    this.#script = script;
    this.#config = denon.config; // just as a shortcut
  }

  /**
   * Restart current process.
   */
  private async reload() {
    if (this.#current) {
      if (Deno.build.os === "windows") {
        this.#current.process.close();
      } else {
        this.#current.process.kill(Deno.Signal.SIGUSR2);
      }
    }
    if (this.#config.logger.fullscreen) console.clear();
    log.warning(`watching path(s): ${this.#config.watcher.match.join(" ")}`);
    log.warning(`watching extensions: ${this.#config.watcher.exts.join(",")}`);
    log.info("restarting due to changes...");
    this.#current = this.#denon.runner.execute(this.#script);
  }

  async *iterate(): AsyncIterator<DenonEvent> {
    yield {
      type: "start",
    };
    this.#current = this.#denon.runner.execute(this.#script);
    for await (const watchE of this.#denon.watcher) {
      if (watchE.some((_) => _.type === "modify")) {
        yield {
          type: "reload",
          change: watchE,
        };
        await this.reload();
      }
      if (this.#current) {
        for await (const exeE of this.#current) {
          if (exeE.type == "alive") break;
          if (exeE.type == "status") {
            if (exeE.status.success) {
              log.info("clean exit - waiting for changes before restart");
              yield {
                type: "success",
                status: exeE.status,
              };
            } else {
              log.info(
                "app crashed - waiting for file changes before starting ...",
              );
              yield {
                type: "crash",
                status: exeE.status,
              };
            }
            this.#current = undefined;
            break;
          }
        }
      }
    }
    yield {
      type: "exit",
    };
  }

  [Symbol.asyncIterator](): AsyncIterator<DenonEvent> {
    return this.iterate();
  }
}
