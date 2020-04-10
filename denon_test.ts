import { test, assertEquals } from "./test_deps.ts";

import { parseArgs, Args } from "./denon.ts";

test(function parseArgsEmpty() {
  const expected: Args = {
    config: undefined,
    debug: false,
    deno_args: [],
    extensions: undefined,
    files: [],
    fullscreen: false,
    help: false,
    interval: undefined,
    match: undefined,
    quiet: false,
    runnerFlags: [],
    skip: undefined,
    watch: undefined,
  };
  assertEquals(parseArgs([]), expected);
});

test(function parseArgsOnlyFile() {
  let args = ["mod.ts"];
  const expected: Args = {
    config: undefined,
    debug: false,
    deno_args: [],
    extensions: undefined,
    files: ["mod.ts"],
    fullscreen: false,
    help: false,
    interval: undefined,
    match: undefined,
    quiet: false,
    runnerFlags: [],
    skip: undefined,
    watch: undefined,
  };
  assertEquals(parseArgs(args), expected);
});

test(function parseArgsWithoutFile() {
  let args = ["--config", "config.json"];
  const expected: Args = {
    config: "config.json",
    debug: false,
    deno_args: [],
    extensions: undefined,
    files: [],
    fullscreen: false,
    help: false,
    interval: undefined,
    match: undefined,
    quiet: false,
    runnerFlags: [],
    skip: undefined,
    watch: undefined,
  };
  assertEquals(parseArgs(args), expected);
});

test(function parseArgsDoubleDashWithoutFile() {
  let args = "-A -c config.json -- --foo bar".split(" ");
  const expected: Args = {
    config: "config.json",
    debug: false,
    deno_args: ["-A"],
    extensions: undefined,
    files: [],
    fullscreen: false,
    help: false,
    interval: undefined,
    match: undefined,
    quiet: false,
    runnerFlags: ["--foo", "bar"],
    skip: undefined,
    watch: undefined,
  };
  assertEquals(parseArgs(args), expected);
});

test(function parseArgsAll() {
  let args = "--config denon.json -dfqhe js,ts -i 500 -m foo/** -s bar/**"
    .split(" ");
  args = args.concat(
    "-w lib/** --importmap=import_map.json -A mod.ts -- --allow-net --port 500"
      .split(" "),
  );
  const expected: Args = {
    config: "denon.json",
    debug: true,
    deno_args: ["--importmap=import_map.json", "-A"],
    extensions: "js,ts",
    files: ["mod.ts"],
    fullscreen: true,
    help: true,
    interval: "500",
    match: "foo/**",
    quiet: true,
    runnerFlags: ["--allow-net", "--port", "500"],
    skip: "bar/**",
    watch: "lib/**",
  };
  assertEquals(parseArgs(args), expected);
});
