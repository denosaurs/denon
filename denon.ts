// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, grant, exists, blue, gray, bold, yellow } from "./deps.ts";

import { Watcher, FileEvent } from "./src/watcher.ts";
import { Runner, Execution } from "./src/runner.ts";

import { readConfig, writeConfig, DenonConfig } from "./src/config.ts";
import { parseArgs, help } from "./src/args.ts";
import { setupLog } from "./src/log.ts";

const VERSION = "v1.9.0";

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

/**
 * These permissions are required on specific situations,
 * `denon` should not be installed with this permissions
 * but you should be granting them when they are required.
 */
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
        if (this.denon.config.logger.fullscreen) console.clear();
        log.warning(
          `watching path(s): ${this.denon.config.watcher.match.join(" ")}`,
        );
        log.warning(
          `watching extensions: ${this.denon.config.watcher.exts.join(" ")}`,
        );
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

  constructor(public config: DenonConfig) {
    this.watcher = new Watcher(config.watcher);
    this.runner = new Runner(config);
  }

  run(script: string): AsyncIterable<DenonEvent> {
    return new Daemon(this, script);
  }
}

/**
 * CLI starts here,
 * other than the awesome `denon` cli this is an
 * example on how the library should be used if 
 * included as a module.
 */
if (import.meta.main) {
  await setupLog();

  // @see PERMISSIONS .
  let permissions = await grant(PERMISSIONS);
  if (!permissions || permissions.length < 2) {
    log.critical("Required permissions `read` and `run` not granted");
    Deno.exit(1);
  }

  const args = parseArgs(Deno.args);
  const config = await readConfig();
  await setupLog(config);

  config.args = args;

  // show help message.
  if (args.help) {
    console.log(help(VERSION));
    Deno.exit(0);
  }

  // show version nunber.
  log.warning(VERSION);
  if (args.version) Deno.exit(0);

  // create configuration file.
  // TODO: should be made interactive.
  if (args.init) {
    let permissions = await grant(PERMISSION_OPTIONAL.write);
    if (!permissions || permissions.length < 1) {
      log.critical("Required permissions `write` not granted");
      Deno.exit(1);
    }
    const file = "denon.json";
    if (!await exists(file)) {
      log.info("creating json configuration...");
      await writeConfig(file);
      log.info("`denon.json` created correctly in root dir");
    } else {
      log.error("`denon.json` already exists in root dir");
    }
    Deno.exit(0);
  }

  // show all available scripts.
  if (args.cmd.length == 0) {
    if (Object.keys(config.scripts).length) {
      log.info("available scripts:");
      const runner = new Runner(config);
      Object.keys(config.scripts).forEach((name) => {
        const script = config.scripts[name];
        console.log();
        console.log(` - ${yellow(bold(name))}`);

        if (typeof script === "object" && script.desc) {
          console.log(`   ${script.desc}`);
        }

        console.log(gray(`   $ ${runner.build(name).cmd.join(" ")}`));
      });
      console.log();
      console.log(
        `You can run scripts with \`${blue("denon")} ${yellow("<script>")}\``,
      );
    }
    Deno.exit(0);
  }

  const script = args.cmd[0];
  const denon = new Denon(config);

  if (config.logger.fullscreen) console.clear();
  log.warning(`watching path(s): ${config.watcher.match.join(" ")}`);
  log.warning(`watching extensions: ${config.watcher.exts.join(" ")}`);

  for await (let _ of denon.run(script)) {}
}
