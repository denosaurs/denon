import { test, assert } from "./test_deps.ts";
import Watcher from "./watcher.ts";

test({
  name: "watch without options",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher([]);
    assert(w.isWatched(""));
    assert(w.isWatched("a.ts"));
    assert(w.isWatched("foo/b.py"));
    assert(w.isWatched("/usr/bin/deno"));
  },
});

test({
  name: "watch with extensions",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher([], { exts: ["ts", ".js"] });
    assert(w.isWatched("a.ts"));
    assert(w.isWatched("./a/b.js"));
    assert(!w.isWatched(""));
    assert(!w.isWatched("foo/b.py"));
    assert(!w.isWatched("foo/b.dts"));
    assert(!w.isWatched("/usr/bin/deno"));
  },
});

test({
  name: "skip",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher([], { skip: ["*test*"] });
    assert(w.isWatched("a.ts"));
    assert(!w.isWatched("a_test.ts"));
    assert(!w.isWatched("a.test.ts"));
    assert(!w.isWatched("/test/a.ts"));
    w = new Watcher([], { skip: ["*test/*"] });
    assert(w.isWatched("a.ts"));
    assert(w.isWatched("a_test.ts"));
    assert(w.isWatched("a.test.ts"));
    assert(!w.isWatched("foo/test/a.ts"));
    assert(!w.isWatched("test/a.ts"));
    assert(!w.isWatched("a/b/test/c/a.ts"));
    w = new Watcher([], { skip: ["**/test/*", "a.*"] });
    assert(!w.isWatched("a.ts"));
    assert(w.isWatched("a_test.ts"));
    assert(!w.isWatched("a.test.ts"));
    assert(!w.isWatched("foo/test/a.ts"));
    assert(w.isWatched("test/a.ts"));
    assert(!w.isWatched("a/b/test/c/a.ts"));
  },
});

test({
  name: "match",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher([], { match: ["lib/**"] });
    assert(w.isWatched("lib/a.ts"));
    assert(!w.isWatched("./lib/a"));
    assert(!w.isWatched("/test/a.ts"));
    assert(!w.isWatched("/usr/lib/a.ts"));
  },
});

test({
  name: "match and skip",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher(
      [],
      { match: ["lib/**"], skip: ["**/*test*"] },
    );
    assert(w.isWatched("lib/a.ts"));
    assert(!w.isWatched("lib/test.ts"));
  },
});

test({
  name: "match, skip and exts",
  async fn(): Promise<void> {
    let w: Watcher | null = new Watcher(
      [],
      { match: ["lib/**"], skip: ["**/*test*"], exts: ["ts"] },
    );
    assert(w.isWatched("lib/a.ts"));
    assert(!w.isWatched("lib/a.js"));
    assert(!w.isWatched("lib/test.ts"));
  },
});
