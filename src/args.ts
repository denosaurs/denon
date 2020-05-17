// TODO
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { parseFlags } from "../deps.ts";

export interface Args {
  help?: boolean;
  version?: boolean;

  config?: string;
}

export function parseArgs(args: string[] = Deno.args): Args {
  return {};
}
