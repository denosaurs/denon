// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { RunnerConfig, Runner } from "./runner.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test({
  name: "runner:build:oneliner",
  async fn(): Promise<void> {
    const config: RunnerConfig = {
      scripts: {
        "oneliner-1": "helloworld.ts",
        "oneliner-2": "deno test helloworld.ts",
        "oneliner-3": "deno test",
        "oneliner-4": "sh build.sh",
      },
    };
    const runner = new Runner(config);

    assertEquals(runner.build("oneliner-1")[0].cmd, [
      "deno",
      "run",
      "helloworld.ts",
    ]);
    assertEquals(runner.build("oneliner-2")[0].cmd, [
      "deno",
      "test",
      "helloworld.ts",
    ]);
    assertEquals(runner.build("oneliner-3")[0].cmd, [
      "deno",
      "test",
    ]);
    assertEquals(runner.build("oneliner-4")[0].cmd, [
      "sh",
      "build.sh",
    ]);
  },
});

Deno.test({
  name: "runner:build:compact",
  async fn(): Promise<void> {
    const config: RunnerConfig = {
      scripts: {
        "compact-1": {
          cmd: "helloworld.ts",
          allow: ["all"],
        },
      },
    };
    const runner = new Runner(config);

    assertEquals(runner.build("compact-1")[0].cmd, [
      "deno",
      "run",
      "--allow-all",
      "helloworld.ts",
    ]);
  },
});

Deno.test({
  name: "runner:build:extended",
  async fn(): Promise<void> {
    const config: RunnerConfig = {
      scripts: {
        "extended-1": {
          cmd: "deno test helloworld.ts",
          allow: ["all"],
        },
        "extended-2": {
          cmd: "deno test",
          allow: ["all"],
        },
        "extended-3": {
          cmd: "sh build.sh",
          allow: ["all"],
        },
      },
    };
    const runner = new Runner(config);

    assertEquals(runner.build("extended-1")[0].cmd, [
      "deno",
      "test",
      "--allow-all",
      "helloworld.ts",
    ]);
    assertEquals(runner.build("extended-2")[0].cmd, [
      "deno",
      "test",
      "--allow-all",
    ]);
    assertEquals(runner.build("extended-3")[0].cmd, [
      "sh",
      "build.sh",
    ]);
  },
});
