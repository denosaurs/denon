export interface Scripts {
  [key: string]: Script;
}

export type Script = string | ScriptObject;

export interface ScriptObject extends ScriptOptions {
  cmd: string;
  desc?: string;
}

export interface FlagsObject {
  [key: string]: unknown;
}

export interface EnvironmentVariables {
  [key: string]: string;
}

/**
 * Additional script options
 * 
 * These can be applied both in `ScriptObject`s and at top-level
 * in which case they're applied to all the scripts defined in the file
 */
export interface ScriptOptions {
  /**
   * A map of environment variables to be passed to the script
   */
  env?: EnvironmentVariables;
  /**
   * A list of boolean `--allow-*` deno cli options or
   * a map of option names to values
   * 
   * ```yaml
   * # scripts.yaml
   * scripts:
   *  start: deno run server.ts
   *  allow:
   *    - net
   *    - read
   * ```
   */
  allow?: string[] | FlagsObject;
  /**
   * The path to an importmap json file,
   * passed to deno cli's `--importmap` option.
   * 
   * **Note** This currently requires the `--unstable` flag
   */
  imap?: string;
  /**
   * The path to an _existing_ lockfile,
   * passed to deno cli's `--lock` option.
   * 
   * **Note** This doesn't create the lockfile, use `--lock-write` manually
   * when appropriate
   */
  lock?: string;
  /**
   * The log level, passed to deno cli's `--log-level` option.
   */
  log?: string;
  /**
   * The path to a tsconfig json file,
   * passed to deno cli's `--tsconfig` option.
   */
  tsconfig?: string;
  /**
   * The path to a PEM certificate file,
   * passed to deno cli's `--cert` option.
   */
  cert?: string;
  /**
   * The hostname and port where to start the inspector,
   * passed to deno cli's `--inspect` option.
   */
  inspect?: string;
  /**
   * Same as `inspect`, but breaks at start of user script.
   */
  inspectBrk?: string;
  /**
   * Standard i/o/err, to be passed directly to Deno.run.
   */
  stdin?: "inherit" | "piped" | "null" | number;
  stdout?: "inherit" | "piped" | "null" | number;
  stderr?: "inherit" | "piped" | "null" | number;
}

export function buildFlags(options: ScriptOptions): string[] {
  let flags: string[] = [];
  if (options.allow) {
    if (Array.isArray(options.allow)) {
      options.allow.forEach((flag) => {
        flags.push(`--allow-${flag}`);
      });
    } else if (typeof options.allow == "object") {
      Object.entries(options.allow).map(([flag, value]) => {
        flags.push(`--allow-${flag}=${value}`);
      });
    }
  }
  if (options.imap) {
    flags.push("--importmap");
    flags.push(options.imap);
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
  if (options.cert) {
    flags.push("--cert");
    flags.push(options.cert);
  }
  if (options.inspect) {
    flags.push(`--inspect=${options.inspect}}`);
  }
  if (options.inspectBrk) {
    flags.push(`--inspect-brk=${options.inspectBrk}}`);
  }
  return flags;
}