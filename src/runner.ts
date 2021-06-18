// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

import {
  buildFlags,
  Script,
  ScriptObject,
  ScriptOptions,
  Scripts,
} from "./scripts.ts";

import { merge } from "./merge.ts";

/** `Runner` configuration.
 * This configuration is, in contrast to other, extended
 * by `Denon` config as scripts has to be a top level
 * parameter. */
export interface RunnerConfig extends ScriptOptions {
  scripts: Scripts;
}

const reDenoAction = new RegExp(/^(deno +\w+) *(.*)$/);
const reCompact = new RegExp(
  /^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\ |\S)+\.(ts|js)$/,
);
const reCliCompact = new RegExp(/^(run|test|fmt|lint) *(.*)$/);

/** Handle all the things related to process management.
 * Scripts are built into executable commands that are
 * executed by `Deno.run()` and managed in an `Executable`
 * object to make available process events. */
export class Runner {
  #config: RunnerConfig;
  #args: string[];

  constructor(config: RunnerConfig, args: string[] = []) {
    this.#config = config;
    this.#args = args;
  }

  private cmd(cmd: string[], options: ScriptOptions): Command {
    const command = {
      cmd,
      options,
      exe: (): Deno.Process => {
        return this.execute(command);
      },
    };
    return command;
  }

  private buildCliCommand(args: string[], global: ScriptOptions): Command {
    const cmd = args.join(" ");
    let out: string[];
    if (reCompact.test(cmd)) {
      out = ["deno", "run"];
      out = out.concat(stdCmd(cmd));
    } else if (reCliCompact.test(cmd)) {
      out = ["deno"];
      out = out.concat(stdCmd(cmd));
    } else {
      out = stdCmd(cmd);
    }
    return this.cmd(out, global); // single command
  }

  private buildCommands(
    script: string | ScriptObject,
    global: ScriptOptions,
    args: string[],
  ): Command[] {
    if (typeof script === "object") {
      const options = Object.assign({}, merge(global, script));
      return this.buildStringCommands(script.cmd, options, args);
    }

    return this.buildStringCommands(script, global, args);
  }

  public buildStringCommands(
    script: string,
    global: ScriptOptions,
    args: string[],
  ): Command[] {
    if (script.includes("&&")) {
      const commands: Command[] = [];
      script.split("&&").map((s) => {
        commands.push(this.buildCommand(s, global, args));
      });
      return commands;
    }

    return [this.buildCommand(script, global, args)];
  }

  private buildCommand(
    cmd: string,
    options: ScriptOptions,
    cli: string[],
  ): Command {
    let out: string[] = [];
    cmd = stdCmd(cmd).join(" ");
    const denoAction = reDenoAction.exec(cmd);
    if (denoAction && denoAction.length === 3) {
      const action = denoAction[1];
      const args = denoAction[2];
      out = out.concat(stdCmd(action));
      out = out.concat(buildFlags(options));
      if (args) out = out.concat(stdCmd(args));
    } else if (reCompact.test(cmd)) {
      out = ["deno", "run"];
      out = out.concat(buildFlags(options));
      out = out.concat(stdCmd(cmd));
    } else {
      out = stdCmd(cmd);
    }

    if (cli) out = out.concat(cli);
    return this.cmd(out, options); // single command
  }

  /** Build the script, in whatever form it is declared in,
   * to be compatible with `Deno.run()`.
   * This function add flags, arguments and actions. */
  build(script: string): Command[] {
    // global options
    const g = Object.assign(
      {
        watch: true, // this is a file watcher after all :)
      },
      this.#config,
    );
    g.scripts = {};

    const s: Script = this.#config.scripts[script];

    if (!s) {
      if (this.#args.length > 0) {
        return [this.buildCliCommand(this.#args, g)];
      } else {
        throw new Error("Script does not exist and CLI args are not provided.");
      }
    }

    const args = this.#args.slice(1);

    let commands: Command[] = [];

    if (Array.isArray(s)) {
      s.forEach((ss) => {
        commands = commands.concat(this.buildCommands(ss, g, args));
      });
    } else {
      commands = commands.concat(this.buildCommands(s, g, args));
    }

    return commands;
  }

  /** Create an `Execution` object to handle the lifetime
   * of the process that is executed. */
  execute(command: Command): Deno.Process {
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

export interface Command {
  cmd: string[];
  options: ScriptOptions;
  exe: () => Deno.Process;
}
