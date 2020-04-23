import {
  yellow,
  green,
  red,
  setColorEnabled,
} from "./deps.ts";
import { DenonConfig } from "./denon_config.ts";

setColorEnabled(true);

let config: DenonConfig;

export function setConfig(newConfig: DenonConfig) {
  config = newConfig;
}

export function fail(reason: string, code: number = 1) {
  if (!config.quiet) {
    console.log(red(`[DENON] ${reason}`));
  }
  Deno.exit(code);
}

export function log(text: string) {
  if (!config.quiet) {
    console.log(green(`[DENON] ${text}`));
  }
}

export function debug(text: string) {
  if (!config.quiet && config.debug) {
    console.log(yellow(`[DENON] ${text}`));
  }
}
