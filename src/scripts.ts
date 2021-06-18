// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

/** Map of declared scripts,
 * Used by `Runner`. */
export interface Scripts {
  [key: string]: Script;
}

/** A runnable script.
 * Can be as simple as a string:
 * ```json
 * {
 *   "start": "deno run app.ts"
 * }
 * ```
 * or as a complex `ScriptObject`:
 * ```json
 * {
 *   "start": {
 *      "cmd": "deno run app.ts",
 *      "desc": "run main application",
 *      "allow": [ "env", "read" ]
 *   }
 * }
 * ``` */
export type Script = string | ScriptObject | ScriptArray;

/** A collection of runnable scripts.
 * See Script */
export type ScriptArray = (string | ScriptObject)[];

/** Most complete representation of a script. Can
 * be configured in details as it extends `ScriptOptions`
 * and can also contain a `desc` that is displayed along
 * script name when`denon` is run without any arguments . */
export interface ScriptObject extends ScriptOptions {
  cmd: string;
  desc?: string;
}

/** Deno CLI flags in a map.
 * `{ allow: { "write": "/tmp", "read": "/tmp" }}`
 * -> `[--allow-write=/tmp, --allow-read=/tmp]` */
export interface FlagsObject {
  [key: string]: unknown;
}

/** Environment variables in a map.
 * `{ TOKEN: "SECRET!" }`
 * -> `TOKEN=SECRET` */
export interface EnvironmentVariables {
  [key: string]: string;
}

/** Additional script options.
 *
 * These can be applied both in `ScriptObject`s and at top-level
 * in which case they're applied to all the scripts defined in the file */
export interface ScriptOptions {
  /** A map of environment variables to be passed to the script */
  env?: EnvironmentVariables;
  /** A list of boolean `--allow-*` deno cli options or
   * a map of option names to values */
  allow?: string[] | FlagsObject | "all";
  /** The path to an importmap json file,
   * passed to deno cli's `--importmap` option.
   *
   * **Note** This currently requires the `--unstable` flag */
  importmap?: string;
  /** The path to a tsconfig json file,
   * passed to deno cli's `--tsconfig` option. */
  tsconfig?: string;
  /** If the code that has to be run is using unstable features
   * from deno standard library this option should be set to
   * `true` so that `--unstable` option is passed to deno cli's. */
  unstable?: boolean;
  /** Skip Typescript type checking module */
  noCheck?: boolean;
  /** The hostname and port where to start the inspector,
   * passed to deno cli's `--inspect` option. */
  inspect?: string;
  /** Same as `inspect`, but breaks at start of user script. */
  inspectBrk?: string;
  /** The path to an _existing_ lockfile,
   * passed to deno cli's `--lock` option.
   *
   * **Note** This doesn't create the lockfile, use `--lock-write` manually
   * when appropriate */
  lock?: string;
  /** The path to a PEM certificate file,
   * passed to deno cli's `--cert` option. */
  cert?: string;
  /** The log level, passed to deno cli's `--log-level` option. */
  log?: string;
  /** Should watch. Enabled by default. Toggle file watching
   * for particular script. */
  watch?: boolean;
  /** Standard i/o/err, to be passed directly to Deno.run. */
  stdin?: "inherit" | "piped" | "null" | number;
  stdout?: "inherit" | "piped" | "null" | number;
  stderr?: "inherit" | "piped" | "null" | number;
}

/** Build deno flags from ScriptOptions.
 * `{ allow: [ run, env ]}` -> `[--allow-run, --allow-env]` */
export function buildFlags(options: ScriptOptions): string[] {
  const flags: string[] = [];
  if (options.allow) {
    if (Array.isArray(options.allow)) {
      options.allow.forEach((flag) => flags.push(`--allow-${flag}`));
    } else if (options.allow === "all") {
      flags.push(`--allow-all`);
    } else if (typeof options.allow === "object") {
      Object.entries(options.allow).map(([flag, value]) => {
        if (!value || (typeof value === "boolean" && value)) {
          flags.push(`--allow-${flag}`);
        } else {
          flags.push(`--allow-${flag}=${value}`);
        }
      });
    }
  }
  if (options.importmap) {
    flags.push("--importmap");
    flags.push(options.importmap);
  }
  if (options.lock) {
    flags.push("--lock");
    flags.push(options.lock);
  }
  if (options.log) {
    flags.push("--log-level");
    flags.push(options.log);
  }
  if (options.tsconfig) {
    flags.push("--config");
    flags.push(options.tsconfig);
  }
  if (options.cert) {
    flags.push("--cert");
    flags.push(options.cert);
  }
  if (options.inspect) {
    flags.push(`--inspect=${options.inspect}`);
  }
  if (options.inspectBrk) {
    flags.push(`--inspect-brk=${options.inspectBrk}`);
  }
  if (options.noCheck) {
    flags.push("--no-check");
  }
  if (options.unstable) {
    flags.push("--unstable");
  }
  return flags;
}
