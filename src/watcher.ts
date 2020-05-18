// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log, deferred, globToRegExp, extname, relative } from "../deps.ts";

type FileEvent =
  | "any"
  | "access"
  | "create"
  | "modify"
  | "remove";

/** A file that was changed, created or removed */
export interface WatcherEvent {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  event: FileEvent;
}

/** All of the options for the `watch` generator */
export interface WatcherConfig {
  /** The number of milliseconds after the last change */
  interval?: number;
  /** Scan for files if in folders of `paths` */
  recursive?: boolean;
  /** The file extensions that it will scan for */
  exts?: string[];
  /** The globs that it will scan for */
  match?: string[];
  /** The globs that it will not scan for */
  skip?: string[];
}

/**
 * Watches for file changes in `paths` path yielding an array of all of the changes
 * each time one or more changes are detected. It is debounced by `interval`.
 * `recursive`, `exts`, `match` and `skip` are filtering the files wich will yield a change
 */
export class Watcher implements AsyncIterable<WatcherEvent[]> {
  private signal = deferred();
  private changes: { [key: string]: FileEvent } = {};
  private interval: number = 500;
  private recursive: boolean = true;
  private exts?: string[];
  private match?: RegExp[];
  private skip?: RegExp[];
  private paths: string[];

  constructor(
    paths: string[],
    private config: WatcherConfig = {},
  ) {
    this.paths = paths;
    this.reload()
  }

  reload() {
    this.interval = this.config.interval || this.interval;
    this.recursive = this.config.recursive || this.recursive
    this.exts = this.config.exts?.map((e) => e.startsWith(".") ? e : `.${e}`);
    this.match = this.config.match?.map((s) =>
      globToRegExp(s, { extended: true, globstar: false })
    );
    this.skip = this.config.skip?.map((s) =>
      globToRegExp(s, { extended: true, globstar: false })
    );
  }

  reset() {
    this.changes = {};
    this.signal = deferred();
  }

  verifyPath(path: string): string {
    this.paths.forEach((directory) => {
      const rel = relative(directory, path);
      if (rel && !rel.startsWith("..")) {
        path = relative(directory, path);
      }
    });
    return path;
  }

  isWatched(
    path: string,
  ): boolean {
    path = this.verifyPath(path);
    log.debug(`evaluating path ${path}`)
    if (extname(path) && this.exts?.length && this.exts?.every((ext) => !path.endsWith(ext))) {
      log.debug(`path ${path} does not have right extension`);
      return false;
    } else if (this.skip && this.skip?.some((skip) => path.match(skip))) {
      log.debug(`path ${path} is skipped`);
      return false;
    } else if (this.match && this.match?.every((match) => !path.match(match))) {
      log.debug(`path ${path} is not matched`);
      return false;
    }
    log.debug(`path ${path} is matched`);
    return true;
  }

  async watch() {
    let timer = 0;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(this.signal.resolve, this.interval);
    };

    for await (
      const event of Deno.watchFs(this.paths, { recursive: this.recursive })
    ) {
      const { kind, paths } = event;
      paths.forEach((path) => {
        if (this.isWatched(path)) {
          this.changes[path] = kind;
          debounce();
        }
      });
    }
  }

  async *iterate(): AsyncIterator<WatcherEvent[]> {
    this.watch();
    while (true) {
      await this.signal;
      yield Object.entries(this.changes).map(([
        path,
        event,
      ]) => ({ path, event }));
      this.reset();
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<WatcherEvent[]> {
    return this.iterate();
  }
}
