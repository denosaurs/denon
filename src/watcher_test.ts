// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { assert } from "https://deno.land/std@0.51.0/testing/asserts.ts";

import { Watcher, WatcherConfig } from "./watcher.ts";
import { setupLog } from "./log.ts";

Deno.test({
  name: "watcher:isWatched",
  async fn(): Promise<void> {
    await setupLog()
    const config: WatcherConfig = {
      exts: ["json"],
      skip: [],
      match: [],
    };

    const watcher = new Watcher([Deno.cwd()], config);
    assert(!watcher.isWatched("src/args.ts"), 'should not match because of extension');

    config.exts = []
    config.skip = ["src/*"]
    watcher.reload()
    assert(!watcher.isWatched("src/args.ts"), 'should not match because parent dir is skipped');
    
    config.exts = []
    config.skip = []
    config.match = ["lib/*"]
    watcher.reload()
    assert(!watcher.isWatched("src/args.ts"), 'should not match because parent dir is not matched');

    config.exts = [".ts"]
    config.skip = []
    config.match = ["*.*"]
    watcher.reload()
    assert(watcher.isWatched("src/args.ts"), 'should match because of extensions');
  },
});
