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

const reDenoAction = new RegExp(/^(deno +\w+) +(.*)$/);
const reCompact = new RegExp(
  /^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\\ |\S)+\.(ts|js)$/,
);
const reCliCompact = new RegExp(/^(run|test|fmt) +(.*)$/);

/**
 * Handle all the things related to process management.
 * Scripts are built into executable commands that are
 * executed by `Deno.run()` and managed in an `Executable`
 * objecto to make available process events.
 */
export class Runner {
  constructor(private config: RunnerConfig) {}

  /**
   * Build the script, in whatever form it is declared in,
   * to be compatible with `Deno.run()`.
   * This function add flags, arguments and actions.
   */
  build(script: string): Command {
    // global options
    const g = Object.assign({}, this.config);
    delete g.scripts;

    const s = this.config.scripts[script];

    if (!s) {
      const cmd = Deno.args.join(" ");
      let out: string[] = [];
      if (reCompact.test(cmd)) {
        out = ["deno", "run"];
        out = out.concat(stdCmd(cmd));
      } else if (reCliCompact) {
        out = ["deno"];
        out = out.concat(stdCmd(cmd));
      } else {
        out = stdCmd(cmd);
      }
      return {
        cmd: out,
        options: g,
      };
    }

    let o: ScriptOptions;
    let cmd: string;

    if (typeof s == "string") {
      o = g;
      cmd = s;
    } else {
      o = Object.assign({}, merge(g, s));
      cmd = s.cmd;
    }

    let out: string[] = [];

    let denoAction = reDenoAction.exec(cmd);
    if (denoAction && denoAction.length == 3) {
      const action = denoAction[1];
      const args = denoAction[2];
      out = out.concat(stdCmd(action));
      out = out.concat(buildFlags(o));
      out = out.concat(stdCmd(args));
    } else if (reCompact.test(cmd)) {
      out = ["deno", "run"];
      out = out.concat(buildFlags(o));
      out = out.concat(stdCmd(cmd));
    } else {
      out = stdCmd(cmd);
    }
    return {
      cmd: out,
      options: o,
    };
  }

  /**
   * Create an `Execution` object to handle the lifetime
   * of the process that is executed.
   */
  execute(script: string): Execution {
    const command = this.build(script);
    log.info(`starting \`${command.cmd.join(" ")}\``);
    const options = {
      cmd: command.cmd,
      env: command.options.env ?? {},
      stdin: command.options.stdin ?? "inherit",
      stdout: command.options.stdout ?? "inherit",
      stderr: command.options.stderr ?? "inherit",
    };
    return new Execution(options);
  }
}

/**
 * Represents a process event.
 * Should reflect the lifetime of a process.
 */
export type ExecutionEvent =
  | ExecutionEventStdout
  | ExecutionEventStderr
  | ExecutionEventStatus
  | ExecutionEventAlive;

export interface ExecutionEventStdout {
  type: "stdout";
  stdout: Uint8Array;
}

export interface ExecutionEventStderr {
  type: "stderr";
  stderr: Uint8Array;
}

export interface ExecutionEventStatus {
  type: "status";
  status: Deno.ProcessStatus;
}

export interface ExecutionEventAlive {
  type: "alive";
}

/**
 * Handle lifetime events of a process,
 * capturing if possible any output and 
 * success status.
 */
export class Execution implements AsyncIterable<ExecutionEvent> {
  process: Deno.Process;

  status?: Deno.ProcessStatus;
  stdout?: Uint8Array;
  stderr?: Uint8Array;

  constructor(public options: Deno.RunOptions) {
    this.process = Deno.run(options);
  }

  close() {
    this.process.close();
    if (this.options.stdin === "piped" && this.process.stdin) {
      this.process.stdin.close();
    }
    if (this.options.stderr === "piped" && this.process.stderr) {
      this.process.stderr.close();
    }
  }

  private async watch() {
    if (this.options.stdout == "piped") {
      this.stdout = await this.process.output();
    }
    if (this.options.stderr == "piped") {
      this.stderr = await this.process.stderrOutput();
    }
    this.status = await this.process.status();
  }

  async *iterate(): AsyncIterator<ExecutionEvent> {
    this.watch();
    while (true) {
      if (this.status) {
        yield {
          type: "status",
          status: this.status,
        };
        break;
      } else if (this.stderr) {
        yield {
          type: "stderr",
          stderr: this.stderr,
        };
      } else if (this.stdout) {
        yield {
          type: "stdout",
          stdout: this.stdout,
        };
      } else {
        yield {
          type: "alive",
        };
      }
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<ExecutionEvent> {
    return this.iterate();
  }
}

function stdCmd(cmd: string): string[] {
  return cmd.trim().replace(/\s\s+/g, " ").split(" ");
}

interface Command {
  cmd: string[];
  options: ScriptOptions;
}
