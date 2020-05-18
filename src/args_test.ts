// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { assertEquals } from "../test_deps.ts";
import { parseArgs } from "./args.ts";

Deno.test({
  name: "parseArgs empty",
  async fn(): Promise<void> {
    const args = parseArgs([]);

    assertEquals(args, {
      help: undefined,
      version: undefined,
      config: undefined,
      paths: undefined,
      interval: undefined,
      recursive: undefined,
      exts: undefined,
      match: undefined,
      skip: undefined,
      command: undefined,
      exeArgs: undefined,
      file: undefined,
      fileArgs: undefined,
    });
  },
});

Deno.test({
  name: "parseArgs command",
  async fn(): Promise<void> {
    const args = parseArgs([
      "run",
      "--allow-all",
      "-e",
      "js,ts,json",
      "file.ts",
      "some",
      "other",
      "args",
    ]);

    assertEquals(args, {
      help: undefined,
      version: undefined,
      config: undefined,
      paths: undefined,
      interval: undefined,
      recursive: undefined,
      exts: ["js", "ts", "json"],
      match: undefined,
      skip: undefined,
      command: "run",
      exeArgs: ["--allow-all"],
      file: "file.ts",
      fileArgs: ["some", "other", "args"],
    });
  },
});

Deno.test({
  name: "parseArgs interval",
  async fn(): Promise<void> {
    assertEquals(
      parseArgs([
        "--interval",
        "1",
      ]).interval,
      1,
    );

    assertEquals(
      parseArgs([
        "--interval",
        "1.1",
      ]).interval,
      undefined,
    );

    assertEquals(
      parseArgs([
        "--interval",
        "asdasd",
      ]).interval,
      undefined,
    );
  },
});
