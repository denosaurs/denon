import { test, assert } from "./test_deps.ts";
import Watcher from "./watcher.ts";

test(async function withoutOptions() {
  let w: Watcher | null = new Watcher([]);
  assert(w.isWatched(""));
  assert(w.isWatched("a.ts"));
  assert(w.isWatched("foo/b.py"));
  assert(w.isWatched("/usr/bin/deno"));
});

test(async function extensions() {
  let w: Watcher | null = new Watcher([], { exts: ["ts", ".js"] });
  assert(w.isWatched("a.ts"));
  assert(w.isWatched("./a/b.js"));
  assert(!w.isWatched(""));
  assert(!w.isWatched("foo/b.py"));
  assert(!w.isWatched("foo/b.dts"));
  assert(!w.isWatched("/usr/bin/deno"));
});

test(async function skip() {
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
});

test(async function match() {
  let w: Watcher | null = new Watcher([], { match: ["lib/**"] });
  assert(w.isWatched("lib/a.ts"));
  assert(!w.isWatched("./lib/a"));
  assert(!w.isWatched("/test/a.ts"));
  assert(!w.isWatched("/usr/lib/a.ts"));
});

test(async function matchAndSkip() {
  let w: Watcher | null = new Watcher(
    [],
    { match: ["lib/**"], skip: ["**/*test*"] },
  );
  assert(w.isWatched("lib/a.ts"));
  assert(!w.isWatched("lib/test.ts"));
});

test(async function matchSkipExts() {
  let w: Watcher | null = new Watcher(
    [],
    { match: ["lib/**"], skip: ["**/*test*"], exts: ["ts"] },
  );
  assert(w.isWatched("lib/a.ts"));
  assert(!w.isWatched("lib/a.js"));
  assert(!w.isWatched("lib/test.ts"));
});
