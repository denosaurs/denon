// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { reConfig } from "./config.ts";

/**
 * Regex to test if string matches version format
 */
const reVersion = /^v?[0-9]+\.[0-9]+\.[0-9]+$/;

/**
 * Map of supported flags that modify
 * `denon` behavior.
 */
export interface Args {
  help: boolean;
  version: boolean;

  init?: string;
  upgrade?: string;
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
    init: undefined,
    upgrade: undefined,
    config: undefined,
    cmd: [],
  };

  if (
    (args.includes("--config") || args.includes("-c")) &&
    args.length > 1
  ) {
    flags.config = args[1];
    args = args.slice(2);
  }

  if (args.includes("--help") || args.includes("-h")) {
    flags.help = true;
    args = args.slice(1);
  }

  if (args.includes("--version") || args.includes("-v")) {
    flags.version = true;
    args = args.slice(1);
  }

  if (args.includes("--init") || args.includes("-i")) {
    const index = args.includes("--init")
      ? args.indexOf("--init")
      : args.indexOf("-i");
    const next = args[index + 1];

    if (next) {
      flags.init = next;
      args = args.slice(2);
    } else {
      flags.init = "denon.json";
      args = args.slice(1);
    }
  }

  if (args.includes("--upgrade") || args.includes("-u")) {
    const index = args.includes("--upgrade")
      ? args.indexOf("--upgrade")
      : args.indexOf("-u");
    const next = args[index + 1];

    if (next && (next === "master" || reVersion.test(next))) {
      flags.upgrade = !next.startsWith("v") || next !== "master"
        ? "v" + next
        : next;
      args = args.slice(2);
    } else {
      flags.upgrade = "master";
      args = args.slice(1);
    }
  }

  flags.cmd = args;
  return flags;
}
