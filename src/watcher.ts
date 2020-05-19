// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  log,
  deferred,
  globToRegExp,
  extname,
  relative,
  walk,
  delay,
} from "../deps.ts";

type FileAction =
  | "any"
  | "access"
  | "create"
  | "modify"
  | "remove";

/** A file that was changed, created or removed */
export interface FileEvent {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  type: FileAction;
}

/** All of the options for the `watch` generator */
export interface WatcherConfig {
  /** An array of paths to watch */
  paths: string[];
  /** The number of milliseconds after the last change */
  interval: number;
  /** The file extensions that it will scan for */
  exts?: string[];
  /** The globs that it will scan for */
  match?: string[];
  /** The globs that it will not scan for */
  skip?: string[];
  /** Use the legacy file monitoring algorithm */
  legacy?: boolean;
}

/**
 * Watches for file changes in `paths` path yielding an array of all of the changes
 * each time one or more changes are detected. It is debounced by `interval`.
 * `recursive`, `exts`, `match` and `skip` are filtering the files wich will yield a change
 */
export class Watcher implements AsyncIterable<FileEvent[]> {
  private signal = deferred();
  private changes: { [key: string]: FileAction } = {};
  private exts?: string[] = undefined;
  private match?: RegExp[] = undefined;
  private skip?: RegExp[] = undefined;
  private watch: Function = this.denoWatch;

  constructor(private config: WatcherConfig) {
    this.reload();
  }

  reload() {
    this.watch = this.config.legacy ? this.legacyWatch : this.denoWatch;
    if (this.config.exts) {
      this.exts = this.config.exts.map((e) => e.startsWith(".") ? e : `.${e}`);
    }
    if (this.config.match) {
      this.match = this.config.match.map((s) =>
        globToRegExp(s, { extended: true, globstar: false })
      );
    }
    if (this.config.skip) {
      this.skip = this.config.skip.map((s) =>
        globToRegExp(s, { extended: true, globstar: false })
      );
    }
  }

  isWatched(path: string): boolean {
    path = this.verifyPath(path);
    log.debug(`evaluating path ${path}`);
    if (
      extname(path) && this.exts?.length &&
      this.exts?.every((ext) => !path.endsWith(ext))
    ) {
      log.debug(`path ${path} does not have right extension`);
      return false;
    } else if (
      this.skip?.length && this.skip?.some((skip) => path.match(skip))
    ) {
      log.debug(`path ${path} is skipped`);
      return false;
    } else if (
      this.match?.length && this.match?.every((match) => !path.match(match))
    ) {
      log.debug(`path ${path} is not matched`);
      return false;
    }
    log.debug(`path ${path} is matched`);
    return true;
  }

  private reset() {
    this.changes = {};
    this.signal = deferred();
  }

  private verifyPath(path: string): string {
    for (const directory of this.config.paths) {
      const rel = relative(directory, path);
      if (rel && !rel.startsWith("..")) {
        path = relative(directory, path);
      }
    }
    return path;
  }

  async *iterate(): AsyncIterator<FileEvent[]> {
    this.watch();
    while (true) {
      await this.signal;
      yield Object.entries(this.changes).map(([
        path,
        type,
      ]) => ({ path, type }));
      this.reset();
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<FileEvent[]> {
    return this.iterate();
  }

  private async denoWatch() {
    let timer = 0;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(this.signal.resolve, this.config.interval);
    };

    const run = async () => {
      for await (
        const event of Deno.watchFs(this.config.paths)
      ) {
        const { kind, paths } = event;
        for (const path of paths) {
          if (this.isWatched(path)) {
            this.changes[path] = kind;
            debounce();
          }
        }
      }
    };
    run();
    while (true) {
      debounce();
      await delay(this.config.interval);
    }
  }

  private async legacyWatch() {
    let timer = 0;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(this.signal.resolve, this.config.interval);
    };

    const walkPaths = async () => {
      const tree: { [path: string]: Date | null } = {};
      for (let i in this.config.paths) {
        const action = walk(this.config.paths[i], {
          maxDepth: Infinity,
          includeDirs: false,
          followSymlinks: false,
          exts: this.exts,
          match: this.match,
          skip: this.skip,
        });
        for await (const { path } of action) {
          if (this.isWatched(path)) {
            const stat = await Deno.stat(path);
            tree[path] = stat.mtime;
          }
        }
      }
      return tree;
    };

    let previous = await walkPaths();

    while (true) {
      const current = await walkPaths();

      for (const path in previous) {
        const pre = previous[path];
        const post = current[path];
        if (pre && !post) {
          this.changes[path] = "remove";
        } else if (
          pre &&
          post &&
          pre.getTime() !== post.getTime()
        ) {
          this.changes[path] = "modify";
        }
      }

      for (const path in current) {
        if (!previous[path] && current[path]) {
          this.changes[path] = "create";
        }
      }

      previous = current;
      debounce();
      await delay(this.config.interval);
    }
  }
}
