// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { parseFlags, setColorEnabled, blue, yellow, gray } from "../deps.ts";

/**
 * Map of supported flags that modify
 * `denon` behavior.
 */
export interface Args {
  help: boolean;
  version: boolean;
  init: boolean;

  cmd: string[];
}

/**
 * Help message to be shown if `denon`
 * is run with `--help` flag.
 */
export function help(version: string): string {
  setColorEnabled(true);
  return `
${blue("DENON")} - ${version}
Monitor any changes in your Deno application and automatically restart.

Usage:
    ${blue("denon")} ${yellow("<script name>")}     ${
    gray("-- eg: denon start")
  }
    ${blue("denon")} ${yellow("<command>")}         ${
    gray("-- eg: denon run helloworld.ts")
  }
    ${blue("denon")} [options]         ${gray("-- eg: denon --help")}

Options:
    -h --help          Show this screen.
    -v --version       Show version.
    -i --init          Create config file in current working dir.
`;
}

/**
 * Parse Deno.args into a flag map (`Args`) 
 * to be handled by th CLI.
 */
export function parseArgs(args: string[] = Deno.args): Args {
  if (args[0] === "--") {
    args = args.slice(1);
  }

  const flags = parseFlags(args, {
    string: [],
    boolean: [
      "help",
      "version",
      "init",
    ],
    alias: {
      help: "h",
      version: "v",
      init: "i",
    },
  });

  return {
    help: flags.help ?? false,
    version: flags.version ?? false,
    init: flags.init ?? false,
    cmd: flags._.map((_) => _.toString()),
  };
}
