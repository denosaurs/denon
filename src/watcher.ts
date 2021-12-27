// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

import { deferred, delay, globToRegExp, log, relative, walk } from "../deps.ts";

const logger = log.create("path");

/** Represents a change in the filesystem.
 * Should reflect the Deno.FsEvent. */
type FileAction = "any" | "access" | "create" | "modify" | "remove" | "other";

/** A file that was changed, created or removed */
export interface FileEvent {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  type: FileAction[];
}

/** All of the options for the `watch` generator */
export interface WatcherConfig {
  /** An array of paths to watch */
  paths?: string[];
  /** The number of milliseconds after the last change */
  interval?: number;
  /** The file extensions that it will scan for */
  exts?: string[];
  /** The globs that it will scan for */
  match?: string[];
  /** The globs that it will not scan for */
  skip?: string[];
  /** Use the legacy file monitoring algorithm */
  legacy?: boolean;
}

/** Watches for file changes in `paths` path
 * yielding an array of all of the changes
 * each time one or more changes are detected.
 * It is debounced by `interval`, `recursive`, `exts`,
 * `match` and `skip` are filtering the files which
 * will yield a change */
export class Watcher implements AsyncIterable<FileEvent[]> {
  #signal = deferred();
  #changes: { [key: string]: FileAction[] } = {};
  #paths: string[] = [Deno.cwd()];
  #interval = 350;
  #exts?: string[] = undefined;
  #match?: RegExp[] = undefined;
  #skip?: RegExp[] = undefined;
  #watch: () => Promise<void> = this.denoWatch;
  #config: WatcherConfig;

  constructor(config: WatcherConfig = {}) {
    this.#config = config;
    this.reload();
  }

  reload(): void {
    this.#watch = this.#config.legacy ? this.legacyWatch : this.denoWatch;
    if (this.#config.paths) {
      this.#paths = this.#config.paths;
    }
    if (this.#config.interval) {
      this.#interval = this.#config.interval;
    }
    if (this.#config.exts) {
      this.#exts = this.#config.exts.map((_) =>
        _.startsWith(".") ? _ : `.${_}`
      );
    }
    if (this.#config.match) {
      this.#match = this.#config.match.map((_) => globToRegExp(_));
    }
    if (this.#config.skip) {
      this.#skip = this.#config.skip.map((_) => globToRegExp(_));
    }
  }

  isWatched(path: string): boolean {
    path = this.verifyPath(path);
    logger.debug(`trying to match ${path}`);

    if (this.#exts?.length && this.#exts?.every((ext) => !path.endsWith(ext))) {
      logger.debug(`path ${path} does not have right extension`);
      return false;
    }

    if (
      this.#skip?.length &&
      this.#skip?.some((skip) => path.match(skip))
    ) {
      logger.debug(`path ${path} is skipped`);
      return false;
    }

    if (
      this.#match?.length && this.#match?.every((match) => !path.match(match))
    ) {
      logger.debug(`path ${path} is not matched`);
      return false;
    }

    logger.debug(`path ${path} is matched`);
    return true;
  }

  private reset(): void {
    this.#changes = {};
    this.#signal = deferred();
  }

  private verifyPath(path: string): string {
    for (const directory of this.#paths) {
      const rel = relative(directory, path);
      if (rel && !rel.startsWith("..")) {
        path = relative(directory, path);
      }
    }
    return path;
  }

  async *iterate(): AsyncIterator<FileEvent[]> {
    this.#watch();
    while (true) {
      await this.#signal;
      yield Object.entries(this.#changes).map(([path, type]) => ({
        path,
        type,
      }));
      this.reset();
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<FileEvent[]> {
    return this.iterate();
  }

  private async denoWatch(): Promise<void> {
    let timer = 0;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(this.#signal.resolve, this.#interval);
    };

    const run = async () => {
      for await (const event of Deno.watchFs(this.#paths)) {
        const { kind, paths } = event;
        for (const path of paths) {
          if (this.isWatched(path)) {
            if (!this.#changes[path]) this.#changes[path] = [];
            this.#changes[path].push(kind);
            debounce();
          }
        }
      }
    };
    run();
    while (true) {
      debounce();
      await delay(this.#interval);
    }
  }

  private async legacyWatch(): Promise<void> {
    let timer = 0;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(this.#signal.resolve, this.#interval);
    };

    const walkPaths = async () => {
      const tree: { [path: string]: Date | null } = {};
      for (const i in this.#paths) {
        const action = walk(this.#paths[i], {
          maxDepth: Infinity,
          includeDirs: false,
          followSymlinks: false,
          exts: this.#exts,
          match: this.#match,
          skip: this.#skip,
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
          if (!this.#changes[path]) this.#changes[path] = [];
          this.#changes[path].push("remove");
        } else if (pre && post && pre.getTime() !== post.getTime()) {
          if (!this.#changes[path]) this.#changes[path] = [];
          this.#changes[path].push("modify");
        }
      }

      for (const path in current) {
        if (!previous[path] && current[path]) {
          if (!this.#changes[path]) this.#changes[path] = [];
          this.#changes[path].push("create");
        }
      }

      previous = current;
      debounce();
      await delay(this.#interval);
    }
  }
}
