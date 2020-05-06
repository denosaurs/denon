import {
  parse,
} from "./deps.ts";

export interface Args {
  debug?: boolean;
  fullscreen?: boolean;
  help?: boolean;
  quiet?: boolean;
  interval?: number;
  config?: string;
  deno_args: string[];
  extensions?: string[];
  files: string[];
  match?: string[];
  runnerFlags: string[];
  skip?: string[];
  watch?: string[];
  fmt?: boolean;
  test?: boolean;
}

export function help() {
  console.log(`
  Usage:
      denon [COMMANDS] [OPTIONS] [DENO_ARGS] [SCRIPT] [-- <SCRIPT_ARGS>]

  OPTIONS:
      -c, --config <file>     A path to a config file, defaults to [default: .denon | .denon.json | .denonrc | .denonrc.json]
      -d, --debug             Debugging mode for more verbose logging
      -e, --extensions        List of extensions to look for separated by commas
      -f, --fullscreen        Clears the screen each reload
      -h, --help              Prints this
      -i, --interval <ms>     The number of milliseconds between each check
      -m, --match <glob>      Glob pattern for all the files to match
      -q, --quiet             Turns off all logging
      -s, --skip <glob>       Glob pattern for ignoring specific files or directories
      -w, --watch             List of paths to watch separated by commas
          --fmt               Adds a deno fmt executor
          --test              Adds a deno test executor

  COMMANDS:
      fmt                     Alias for flag --fmt
      test                    Alias for flag --test

  DENO_ARGS: Arguments passed to Deno to run SCRIPT (like permisssions)
  `);
}

function chooseLast(arg: string | string[] | undefined): string | undefined {
  if (Array.isArray(arg)) {
    return arg[arg.length - 1];
  }
  return arg;
}

function convertToStringArray(
  arg: string | string[] | undefined,
): string[] | undefined {
  if (typeof arg === "string") {
    return arg.split(",");
  } else if (Array.isArray(arg)) {
    return arg.reduce(
      (acc, curr) => acc.concat(curr.split(",")),
      [] as string[],
    );
  }
  return arg;
}

export function parseArgs(args: string[]): Args {
  if (args[0] === "--") {
    args = args.slice(1);
  }

  let deno_args: string[] = [];
  const files: string[] = [];

  let fmt = false;
  let test = false;

  const flags = parse(args, {
    string: ["config", "extensions", "interval", "match", "skip", "watch"],
    boolean: ["debug", "fullscreen", "help", "quiet", "fmt", "test"],
    alias: {
      config: "c",
      debug: "d",
      extensions: "e",
      fullscreen: "f",
      help: "h",
      interval: "i",
      match: "m",
      quiet: "q",
      skip: "s",
      watch: "w",
    },
    "--": true,
    unknown: (arg: string, k?: string, v?: unknown) => {
      if (k == null && v == null) {
        switch (arg) {
          case "fmt":
            fmt = true;
            break;
          case "test":
            test = true;
            break;
          default:
            files.push(arg);
            break;
        }
        return false;
      }
      deno_args.push(arg);
      if (v && !arg.endsWith(String(v)) && typeof (v) !== "boolean") {
        deno_args.push(String(v));
      }
      return false;
    },
  });

  const script = deno_args[deno_args.length - 1];
  if (script && !script.startsWith("-")) {
    files.push(script);
    deno_args = deno_args.slice(0, -1);
  }

  return {
    debug: flags.debug,
    help: flags.help,
    fullscreen: flags.fullscreen,
    quiet: flags.quiet,
    config: chooseLast(flags.config),
    interval: flags.interval ? parseInt(flags.interval, 10) : undefined,
    extensions: convertToStringArray(flags.extensions),
    match: convertToStringArray(flags.match),
    skip: convertToStringArray(flags.skip),
    watch: convertToStringArray(flags.watch),
    files,
    runnerFlags: flags["--"],
    deno_args,
    fmt: fmt || flags.fmt,
    test: test || flags.test,
  };
}

export function applyIfDefined(source: any, target: any, properties: string[]) {
  properties.forEach((p) => {
    const value = source[p];
    if (value != null) {
      target[p] = source[p];
    }
  });
}
