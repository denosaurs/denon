import { test, assertEquals } from "./test_deps.ts";

import { parseArgs, Args, applyIfDefined } from "./cli.ts";

test({
  name: "parseArgs empty",
  fn(): void {
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
      fmt: false,
      test: false,
    };
    assertEquals(parseArgs([]), expected);
  },
});

test({
  name: "parseArgs only file",
  fn(): void {
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
      fmt: false,
      test: false,
    };
    assertEquals(parseArgs(args), expected);
  },
});

test({
  name: "parseArgs without file",
  fn(): void {
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
      fmt: false,
      test: false,
    };
    assertEquals(parseArgs(args), expected);
  },
});

test({
  name: "parseArgs double dash without file",
  fn(): void {
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
      fmt: false,
      test: false,
    };
    assertEquals(parseArgs(args), expected);
  },
});

test({
  name: "parseArgs all",
  fn(): void {
    let args =
      "--config denon.json -dfqhe js,ts -i 500 -m foo/** -s bar/** --fmt --test"
        .split(" ");
    args = args.concat(
      "-w lib/** --importmap=import_map.json -A mod.ts -- --allow-net --port 500"
        .split(" "),
    );
    const expected: Args = {
      config: "denon.json",
      debug: true,
      deno_args: ["--importmap=import_map.json", "-A"],
      extensions: ["js", "ts"],
      files: ["mod.ts"],
      fullscreen: true,
      help: true,
      interval: 500,
      match: ["foo/**"],
      quiet: true,
      runnerFlags: ["--allow-net", "--port", "500"],
      skip: ["bar/**"],
      watch: ["lib/**"],
      fmt: true,
      test: true,
    };
    assertEquals(parseArgs(args), expected);
  },
});

test({
  name: "parseArgs duplicates",
  fn(): void {
    let args = "-dd -c .rc1 -c .rc2 -e js,ts -e py -m foo,bar -m bla".split(
      " ",
    );
    args = args.concat(
      "-s foo,bar -s bla -w foo,bar -w bla file1 file2".split(" "),
    );
    const expected: Args = {
      config: ".rc2",
      debug: true,
      deno_args: [],
      extensions: ["js", "ts", "py"],
      files: ["file1", "file2"],
      fullscreen: false,
      help: false,
      interval: undefined,
      match: ["foo", "bar", "bla"],
      quiet: false,
      runnerFlags: [],
      skip: ["foo", "bar", "bla"],
      watch: ["foo", "bar", "bla"],
      fmt: false,
      test: false,
    };
    assertEquals(parseArgs(args), expected);
  },
});

test({
  name: "applyIfDefined test",
  fn(): void {
    const source = { a: 1, b: 2, d: undefined };
    const target = { a: 3, c: 4 };
    applyIfDefined(source, target, ["a"]);
    assertEquals(target, { a: 1, c: 4 });
    applyIfDefined(source, target, ["a", "b"]);
    assertEquals(target, { a: 1, b: 2, c: 4 });
    applyIfDefined(source, target, ["d"]);
    assertEquals(target, { a: 1, b: 2, c: 4 });
    applyIfDefined(source, target, ["e"]);
    assertEquals(target, { a: 1, b: 2, c: 4 });
  },
});
