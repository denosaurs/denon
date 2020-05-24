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

  const flags: Args = {
    help: false,
    version: false,
    init: false,
    upgrade: false,
    cmd: [],
  };

  if (
    (args.indexOf("--config") === 0 || args.indexOf("-c") === 0) &&
    args.length > 1
  ) {
    flags.config = args[1];
    args = args.slice(2);
  }

  if (args.indexOf("--help") === 0 || args.indexOf("-h") === 0) {
    flags.help = true;
    args = args.slice(1);
  }

  if (args.indexOf("--version") === 0 || args.indexOf("-v") === 0) {
    flags.version = true;
    args = args.slice(1);
  }

  if (args.indexOf("--init") === 0 || args.indexOf("-i") === 0) {
    flags.init = true;
    args = args.slice(1);
  }

  if (args.indexOf("--upgrade") === 0 || args.indexOf("-u") === 0) {
    flags.upgrade = true;
    args = args.slice(1);
  }

  flags.cmd = args;
  return flags;
}
