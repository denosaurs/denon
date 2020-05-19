// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, deferred } from "../deps.ts";

import { Scripts, ScriptOptions, buildFlags } from "./scripts.ts";

import { merge } from "./merge.ts";

interface Command {
  cmd: string[];
  options: ScriptOptions;
}

export interface RunnerConfig extends ScriptOptions {
  scripts: Scripts;
}

const reDenoAction = new RegExp(/^(deno +\w+) +(.*)$/);
const reCompact = new RegExp(
  /^'(?:\\'|.)*?\.(ts|js)'|^"(?:\\"|.)*?\.(ts|js)"|^(?:\\\ |\S)+\.(ts|js)$/,
);
const reCliCompact = new RegExp(/^(run|test|fmt) +(.*)$/);

function stdCmd(cmd: string): string[] {
  return cmd.trim().replace(/\s\s+/g, " ").split(" ");
}

export class Runner {
  constructor(private config: RunnerConfig) {}

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

    // it does not have ScriptOptions
    if (typeof s == "string") {
      let out: string[] = [];
      if (reCompact.test(s)) {
        out = ["deno", "run"];
        out = out.concat(stdCmd(s));
      } else {
        out = stdCmd(s);
      }
      return {
        cmd: out,
        options: g,
      };
    }

    // it does have ScriptOptions
    const o = merge({}, g, s) as ScriptOptions;
    let out: string[] = [];
    const cmd = s.cmd;

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
   * Execute process command.
   * @returns process spawned
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

export class Execution implements AsyncIterable<ExecutionEvent> {
  private signal = deferred();
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
