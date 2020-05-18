// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { parseFlags, log } from "../deps.ts";
import { isPositiveInteger } from "./util.ts";

/**
 * Split CLI argument params to be better handled in typescript.
 * @param arg CLI argument, can be "param1,param2", "["param1,param2"]" or undefined.
 * @returns single array containing split paramenters.
 */
function toArray(arg: string | string[] | undefined): string[] | undefined {
  if (typeof arg === "string") {
    return arg.split(",");
  } else if (Array.isArray(arg)) {
    return arg.reduce(
      (acc, curr) => acc.concat(curr.split(",")),
      [] as string[],
    );
  }
  return arg;
}

type DenonCommand =
  | "run"
  | "bundle"
  | "test"
  | "fmt";

export declare interface Args {
  help?: boolean;
  version?: boolean;

  config?: string;

  command?: DenonCommand;

  paths?: string[];
  interval?: number;
  recursive?: boolean;
  exts?: string[];
  match?: string[];
  skip?: string[];

  exeArgs?: string[];
  file?: string;
  fileArgs?: string[];
}

/**
 * Parse Deno.args() into a compiled and compatible Config subset (Args).
 * @param args Deno.args() or other input source.
 * @returns compiled Args interface.
 */
export function parseArgs(args: string[] = Deno.args): Args {
  if (args[0] === "--") {
    args = args.slice(1);
  }

  const unknowns: string[] = [];
  const exeArgs: string[] = [];

  let command: DenonCommand | undefined;

  const flags = parseFlags(args, {
    string: [
      "config",

      "paths",
      "interval",
      "exts",
      "match",
      "skip",
    ],
    boolean: [
      "help",
      "version",

      "recursive",

      "debug",
      "quiet",
      "fullscreen",
    ],
    alias: {
      config: "c",

      help: "h",
      version: "V",

      match: "m",
      exts: "e",
      skip: "s",
      interval: "i",

      debug: "d",
      quiet: "q",
      fullscreen: "f",
    },
    "--": true,
    unknown: (arg: string, key?: string, value?: unknown) => {
      if (key === undefined && value === undefined) {
        switch (arg) {
          case "run":
          case "bundle":
          case "test":
          case "fmt":
            if (!command) {
              command = arg;
              break;
            }
          default:
            unknowns.push(arg);
            break;
        }
        return false;
      }

      exeArgs.push(arg);
      if (
        value && !arg.endsWith(String(value)) && typeof (value) !== "boolean"
      ) {
        exeArgs.push(String(value));
      }
      return false;
    },
  });

  let interval;
  if (flags.interval) {
    if (isPositiveInteger(flags.interval)) {
      interval = parseInt(flags.interval);
    } else {
      log.warning("-i --interval works only with integers, using default");
    }
  }

  const [file, ...fileArgs] = unknowns;

  return {
    help: !flags.help ? undefined : flags.help,
    version: !flags.version ? undefined : flags.version,
    config: flags.config,
    paths: toArray(flags.paths),
    interval,
    recursive: !flags.recursive ? undefined : flags.recursive,
    exts: toArray(flags.exts),
    match: toArray(flags.match),
    skip: toArray(flags.skip),
    command,
    exeArgs: exeArgs.length === 0 ? undefined : exeArgs,
    file,
    fileArgs: fileArgs.length === 0 ? undefined : fileArgs,
  };
}
