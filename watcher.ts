import { deferred, globToRegExp, resolve } from "./deps.ts";

type FileEvent = "any" | "access" | "create" | "modify" | "remove";

/** A file that was changed, created or removed */
export interface FileChange {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  event: FileEvent;
}

/** All of the options for the `watch` generator */
export interface WatchOptions {
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
export default class Watcher implements AsyncIterable<FileChange[]> {
  // private events: AsyncIterableIterator<Deno.FsEvent>;
  private signal = deferred();
  private changes: { [key: string]: FileEvent } = {};
  private interval: number;
  private exts?: string[];
  private match?: RegExp[];
  private skip?: RegExp[];
  private recursive: boolean;
  private paths: string[];

  constructor(
    paths: string[],
    {
      interval = 500,
      recursive = true,
      exts = undefined,
      match = undefined,
      skip = undefined,
    }: WatchOptions = {},
  ) {
    this.paths = paths.map((p) => resolve(p));
    this.interval = interval;
    this.exts = exts?.map((e) => e.startsWith(".") ? e : `.${e}`);
    this.match = match?.map((s) =>
      globToRegExp(s, { extended: true, globstar: false })
    );
    this.skip = skip?.map((s) =>
      globToRegExp(s, { extended: true, globstar: false })
    );
    this.recursive = recursive ?? true;
  }

  reset() {
    this.changes = {};
    this.signal = deferred();
  }

  isWatched(
    path: string,
  ): boolean {
    if (this.exts?.every((ext) => !path.endsWith(ext))) {
      return false;
    } else if (this.skip?.some((skip) => path.match(skip))) {
      return false;
    } else if (this.match?.every((match) => !path.match(match))) {
      return false;
    }
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

  async *iterate(): AsyncIterator<FileChange[]> {
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

  [Symbol.asyncIterator](): AsyncIterator<FileChange[]> {
    return this.iterate();
  }
}
