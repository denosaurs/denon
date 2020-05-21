// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { assertEquals } from "../test_deps.ts";
import { parseArgs } from "./args.ts";

Deno.test({
  name: "parseArgs",
  async fn(): Promise<void> {
    assertEquals(parseArgs([]), {
      help: false,
      version: false,
      init: false,
      config: undefined,

      cmd: [],
    });

    assertEquals(parseArgs(["-h", "-v", "-i", "-c", "config"]), {
      help: true,
      version: true,
      init: true,
      config: "config",

      cmd: [],
    });

    assertEquals(
      parseArgs(["--help", "--version", "--init", "--config=config"]),
      {
        help: true,
        version: true,
        init: true,
        config: "config",

        cmd: [],
      },
    );

    assertEquals(parseArgs(["a", "b", "-d", "e", "--f"]), {
      help: false,
      version: false,
      init: false,
      config: undefined,

      cmd: ["a", "b"],
    });
  },
});
