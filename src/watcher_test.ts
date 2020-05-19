// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { assert } from "../test_deps.ts";

import { Watcher, WatcherConfig } from "./watcher.ts";
import { setupLog } from "./log.ts";

Deno.test({
  name: "watcher:exts",
  async fn(): Promise<void> {
    await setupLog();
    const config: WatcherConfig = {
      paths: [Deno.cwd()],
      interval: 350,
      exts: ["json"],
      skip: [],
      match: [],
    };

    const watcher = new Watcher(config);
    assert(
      !watcher.isWatched("src/args.ts"),
      "should not match because of extension",
    );

    config.exts = [];
    config.skip = ["src/*"];
    watcher.reload();
    assert(
      !watcher.isWatched("src/args.ts"),
      "should not match because parent dir is skipped",
    );

    config.exts = [];
    config.skip = [];
    config.match = ["lib/*"];
    watcher.reload();
    assert(
      !watcher.isWatched("src/args.ts"),
      "should not match because parent dir is not matched",
    );

    config.exts = [".ts"];
    config.skip = [];
    config.match = ["*.*"];
    watcher.reload();
    assert(
      watcher.isWatched("src/args.ts"),
      "should match because of extensions",
    );
  },
});

Deno.test({
  name: "watcher:skip",
  async fn(): Promise<void> {
    await setupLog();
    const config: WatcherConfig = {
      paths: [Deno.cwd()],
      interval: 350,
      exts: [],
      skip: ["src/*"],
      match: [],
    };

    const watcher = new Watcher(config);
    assert(
      !watcher.isWatched("src/args.ts"),
      "should not match because parent dir is skipped",
    );
  },
});
