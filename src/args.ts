// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { parseFlags } from "../deps.ts";

/**
 * Map of supported flags that modify
 * `denon` behavior.
 */
export interface Args {
  help: boolean;
  version: boolean;
  init: boolean;
  upgrade: boolean;

  config?: string;

  cmd: string[];
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
    string: [
      "config",
    ],
    boolean: [
      "help",
      "version",
      "init",
      "upgrade",
    ],
    alias: {
      help: "h",
      version: "v",
      init: "i",
      config: "c",
    },
  });

  return {
    help: flags.help ?? false,
    version: flags.version ?? false,
    init: flags.init ?? false,
    upgrade: flags.upgrade ?? false,

    config: flags.config,

    cmd: flags._.map((_: any) => _.toString()),
  };
}
