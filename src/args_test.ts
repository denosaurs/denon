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

      cmd: [],
    });

    assertEquals(parseArgs(["-h", "-v", "-i"]), {
      help: true,
      version: true,
      init: true,

      cmd: [],
    });

    assertEquals(parseArgs(["--help", "--version", "--init"]), {
      help: true,
      version: true,
      init: true,

      cmd: [],
    });

    assertEquals(parseArgs(["a", "b", "-c", "d", "--e"]), {
      help: false,
      version: false,
      init: false,

      cmd: ["a", "b"],
    });
  },
});
