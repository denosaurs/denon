// TODO

import { parseFlags } from "../deps.ts";

export interface Args {
  help?: boolean;
  version?: boolean;

  config?: string;
}

export function parseArgs(args: string[] = Deno.args): Args {
  return {};
}
