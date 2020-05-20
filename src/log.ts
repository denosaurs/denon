// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
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
 */
function formatter(record: LogRecord): string {
  let msg = `${TAG} ${reset(record.msg)}`;

  for (const arg of record.args) {
    if (arg instanceof Object) {
      msg += ` ${JSON.stringify(arg)}`;
    } else {
      msg += ` ${String(arg)}`;
    }
  }
  return msg;
}

/**
 * Determines the log level based on configuration
 * preferences.
 */
function logLevel(config: DenonConfig): LogLevelName {
  let level: LogLevelName = DEFAULT_LEVEL;
  if (config.debug) level = DEBUG_LEVEL;
  if (config.quiet) level = QUIET_LEVEL;
  return level;
}

/**
 * Modify default deno logger with configurable
 * log level.
 */
export async function setupLog(config?: DenonConfig): Promise<void> {
  const level = config ? logLevel(config) : DEBUG_LEVEL;
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
