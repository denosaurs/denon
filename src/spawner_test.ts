// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { Spawner, SpawnerConfig } from "./spawner.ts";
import { assertEquals } from "https://deno.land/std@0.51.0/testing/asserts.ts";

Deno.test({
  name: "spawner:build",
  async fn(): Promise<void> {
    const config: SpawnerConfig = {
      exe: {},
      file: "hello_world.ts",
    };
    const spawner = new Spawner(config);

    assertEquals(spawner.build(), ["deno", "run", "hello_world.ts"]);

    config.exe = {
      "ts": [
        "deno",
        "run",
        "FIXED_EXE_ARG",
        "${exe-args}",
        "${file}",
        "FIXED_FILE_ARG",
        "${file-args}",
      ],
    };
    assertEquals(
      spawner.build(),
      ["deno", "run", "FIXED_EXE_ARG", "hello_world.ts", "FIXED_FILE_ARG"],
    );

    config.exe = {
      "ts":
        "deno run FIXED_EXE_ARG ${exe-args} ${file} FIXED_FILE_ARG ${file-args}",
    };
    assertEquals(
      spawner.build(),
      ["deno", "run", "FIXED_EXE_ARG", "hello_world.ts", "FIXED_FILE_ARG"],
    );

    config.exe = {};
    config.exeArgs = ["DYNAMIC_EXE_ARG"];
    config.fileArgs = ["DYNAMIC_FILE_ARG"];
    assertEquals(
      spawner.build(),
      ["deno", "run", "DYNAMIC_EXE_ARG", "hello_world.ts", "DYNAMIC_FILE_ARG"],
    );

    config.exe = {
      "sh": ["sh", "${file}", "${file-args}"],
    };
    config.exeArgs = ["SHOULD_NOT_SHOW_UP"];
    config.fileArgs = ["--dist", "win32"];
    config.file = "start.sh";
    assertEquals(
      spawner.build(),
      ["sh", "start.sh", "--dist", "win32"],
    );
  },
});
