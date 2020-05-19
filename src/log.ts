// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  setColorEnabled,
  log,
  reset,
  LogRecord,
  LogLevelName,
} from "../deps.ts";

import { DenonConfig } from "./config.ts";

export declare interface LogConfig {
  /**
   * Disables logging
   */
  quiet?: boolean;
  /**
   * Enables debugging
   */
  debug?: boolean;
  /**
   * Clear the console on reload events
   */
  fullscreen?: boolean;
}

/**
 * Logger tag
 */
const TAG = "[denon]";

const DEBUG_LEVEL = "DEBUG";
const QUIET_LEVEL = "ERROR";
const DEFAULT_LEVEL = "INFO";

const DEFAULT_HANDLER = "format_fn";

/**
 * Deno logger, but slightly better.
 * @param logRecord passed by Deno, contains logging info
 */
function formatter(logRecord: LogRecord): string {
  let msg = `${TAG} ${reset(logRecord.msg)}`;

  for (const arg of logRecord.args) {
    if (arg instanceof Object) {
      msg += ` ${JSON.stringify(arg)}`;
    } else {
      msg += ` ${String(arg)}`;
    }
  }

  return msg;
}

function logLevel(config: DenonConfig): LogLevelName {
  let level: LogLevelName = DEFAULT_LEVEL;
  if (config.debug) level = DEBUG_LEVEL;
  if (config.quiet) level = QUIET_LEVEL;
  return level;
}

/**
 * Modify default deno logger.
 * @param config denom config
 */
export async function setupLog(config?: DenonConfig): Promise<void> {
  const level = config ? logLevel(config) : DEBUG_LEVEL;
  setColorEnabled(Deno.noColor);
  await log.setup({
    handlers: {
      [DEFAULT_HANDLER]: new log.handlers.ConsoleHandler(DEBUG_LEVEL, {
        formatter,
      }),
    },
    loggers: {
      default: {
        level,
        handlers: [DEFAULT_HANDLER],
      },
    },
  });
}
