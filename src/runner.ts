// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log } from "../deps.ts";

import { Scripts, ScriptOptions, buildFlags } from "./scripts.ts";

import { merge } from "./merge.ts";

/**
 * `Runner` configuration.
 * This configuration is, in contrast to other, extended
 * by `Denon` config as scripts has to be a top level
 * parameter.
 */
export interface RunnerConfig extends ScriptOptions {
  scripts: Scripts;
}

const reDenoAction = new RegExp(/^(deno +\w+) *(.*)$/);
const reCompact = new RegExp(
  /^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\\ |\S)+\.(ts|js)$/,
);
const reCliCompact = new RegExp(/^(run|test|fmt) *(.*)$/);

/**
 * Handle all the things related to process management.
 * Scripts are built into executable commands that are
 * executed by `Deno.run()` and managed in an `Executable`
 * object to make available process events.
 */
export class Runner {
  #config: RunnerConfig;
  #args: string[];

  constructor(config: RunnerConfig, args: string[] = []) {
    this.#config = config;
    this.#args = args;
  }

  /**
   * Build the script, in whatever form it is declared in,
   * to be compatible with `Deno.run()`.
   * This function add flags, arguments and actions.
   */
  build(script: string): Command {
    // global options
    const g = Object.assign({
      watch: true, // we are a file watcher after all :)
    }, this.#config);
    delete g.scripts;

    const s = this.#config.scripts[script];

    if (!s && this.#args) {
      const cmd = this.#args.join(" ");
      let out: string[] = [];
      if (reCompact.test(cmd)) {
        out = ["deno", "run"];
        out = out.concat(stdCmd(cmd));
      } else if (reCliCompact.test(cmd)) {
        out = ["deno"];
        out = out.concat(stdCmd(cmd));
      } else {
        out = stdCmd(cmd);
      }
      const command = {
        cmd: out,
        options: g,
        exe: (): Deno.Process => {
          return this.execute(command);
        },
      };
      return command;
    }

    let o: ScriptOptions;
    let cmd: string;

    if (typeof s === "string") {
      o = g;
      cmd = s;
    } else {
      o = Object.assign({}, merge(g, s));
      cmd = s.cmd;
    }

    let out: string[] = [];

    let denoAction = reDenoAction.exec(cmd);
    if (denoAction && denoAction.length === 3) {
      const action = denoAction[1];
      const args = denoAction[2];
      out = out.concat(stdCmd(action));
      out = out.concat(buildFlags(o));
      if (args) out = out.concat(stdCmd(args));
    } else if (reCompact.test(cmd)) {
      out = ["deno", "run"];
      out = out.concat(buildFlags(o));
      out = out.concat(stdCmd(cmd));
    } else {
      out = stdCmd(cmd);
    }
    const command = {
      cmd: out,
      options: o,
      exe: (): Deno.Process => {
        return this.execute(command);
      },
    };
    return command;
  }

  /**
   * Create an `Execution` object to handle the lifetime
   * of the process that is executed.
   */
  execute(command: Command): Deno.Process {
    log.info(`starting \`${command.cmd.join(" ")}\``);
    const options = {
      cmd: command.cmd,
      env: command.options.env ?? {},
      stdin: command.options.stdin ?? "inherit",
      stdout: command.options.stdout ?? "inherit",
      stderr: command.options.stderr ?? "inherit",
    };
    return Deno.run(options);
  }
}

function stdCmd(cmd: string): string[] {
  return cmd.trim().replace(/\s\s+/g, " ").split(" ");
}

interface Command {
  cmd: string[];
  options: ScriptOptions;
  exe: () => Deno.Process;
}
