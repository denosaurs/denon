// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log } from "../deps.ts";

import { Denon, DenonEvent } from "../denon.ts";
import { DenonConfig } from "./config.ts";

/**
 * Daemon instance. 
 * Returned by Denon instance when
 * `start(script)` is called. It can be used in a for
 * loop to listen to DenonEvents.
 */
export class Daemon implements AsyncIterable<DenonEvent> {
  #denon: Denon;
  #script: string;
  #config: DenonConfig;
  #processes: { [pid: number]: Deno.Process } = {};

  constructor(denon: Denon, script: string) {
    this.#denon = denon;
    this.#script = script;
    this.#config = denon.config; // just as a shortcut
  }

  /**
   * Restart current process.
   */
  private async reload() {
    if (this.#config.logger.fullscreen) {
      log.debug("Clearing screen");
      console.clear();
    }

    log.info(`watching path(s): ${this.#config.watcher.match.join(" ")}`);
    log.info(`watching extensions: ${this.#config.watcher.exts.join(",")}`);
    log.info("restarting due to changes...");

    // kill all processes spawned
    let pcopy = Object.assign({}, this.#processes);
    this.#processes = {};
    for (let id in pcopy) {
      const p = pcopy[id];
      if (Deno.build.os === "windows") {
        log.debug(`Closing process with pid ${p.pid}`);
        p.close();
      } else {
        log.debug(`Killing process with pid ${p.pid}`);
        p.kill(Deno.Signal.SIGUSR2);
      }
    }

    await this.start();
  }

  private async start() {
    const process = this.#denon.runner.execute(this.#script);
    this.#processes[process.pid] = (process);
    this.monitor(process);
  }

  private async monitor(process: Deno.Process) {
    const s = await process.status();
    let p = this.#processes[process.pid];
    if (p) {
      // process exited on its own, so we should wait a reload
      // remove it from processes array as it is already dead
      delete this.#processes[process.pid];

      // log status status
      if (s.success) {
        log.info("clean exit - waiting for changes before restart");
      } else {
        log.info(
          "app crashed - waiting for file changes before starting ...",
        );
      }
    }
  }

  async *iterate(): AsyncIterator<DenonEvent> {
    yield {
      type: "start",
    };
    this.start();
    for await (const watchE of this.#denon.watcher) {
      if (watchE.some((_) => _.type === "modify")) {
        yield {
          type: "reload",
          change: watchE,
        };
        await this.reload();
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
