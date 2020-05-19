// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { parseFlags } from "../deps.ts";

export interface Args {
  help: boolean;
  version: boolean;
  cmd: string[];
}

/**
 * Parse Deno.args into a compiled and compatible Config subset (Args).
 * @param args Deno.args or other input source.
 * @returns compiled Args interface.
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
    ],
    alias: {
      help: "h",
      version: "v",
    },
  });

  return {
    help: flags.help ?? false,
    version: flags.version ?? false,
    cmd: flags._.map((_) => _.toString()),
  };
}
