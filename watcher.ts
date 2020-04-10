import { walk } from "./deps.ts";

/** All of the types of changes that a file can have */
export enum FileEvent {
  /** The file was changed */
  Changed,
  /** The file was created */
  Created,
  /** The file was remove */
  Removed,
}

/** A file that was changed, created or removed */
export interface FileChange {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  event: FileEvent;
}

/** All of the options for the `watch` generator */
export interface WatchOptions {
  /** The number of milliseconds between each scan */
  interval?: number;
  /** The max depth that it will scan for files at */
  maxDepth?: number;
  /** The file extensions that it will scan for */
  exts?: string[];
  /** The regexps that it will scan for */
  match?: RegExp[];
  /** The regexps that it will not scan for */
  skip?: RegExp[];
}

/**
 * Watches for file changes in `target` path yielding an array of all of the changes
 * each time one or more changes are detected. It does this once every `interval`.
 * `maxDepth`, `exts`, `match` and `skip` are all passed to the `fs.walk` generator
 * which makes everything work. Because it uses `fs.walk` it is very inefficient for
 * large directories.
 */
export async function* watch(
  target: string,
  {
    interval = 500,
    maxDepth = Infinity,
    exts = undefined,
    match = undefined,
    skip = undefined,
  }: WatchOptions = {},
): AsyncGenerator<FileChange[]> {
  let prevFiles: { [filename: string]: number | null } = {};

  // First walk the target path so we dont create `Created` events for files that are already there
  for await (
    const { filename, info } of walk(target, {
      maxDepth: maxDepth,
      includeDirs: false,
      followSymlinks: false,
      exts: exts,
      match: match,
      skip: skip,
    })
  ) {
    prevFiles[filename] = info.modified;
  }

  while (true) {
    const currFiles: { [filename: string]: number | null } = {};
    const changes = [];
    const start = Date.now();

    // Walk the target path and put all of the files into an array
    for await (
      const { filename, info } of walk(target, {
        maxDepth: maxDepth,
        includeDirs: false,
        followSymlinks: false,
        exts: exts,
        match: match,
        skip: skip,
      })
    ) {
      currFiles[filename] = info.modified;
    }

    for (const file in prevFiles) {
      // Check if a file has been removed else check if has been changed
      if (prevFiles[file] && !currFiles[file]) {
        changes.push({
          path: file,
          event: FileEvent.Removed,
        });
      } else if (
        prevFiles[file] &&
        currFiles[file] &&
        prevFiles[file] !== currFiles[file]
      ) {
        changes.push({
          path: file,
          event: FileEvent.Changed,
        });
      }
    }

    for (const file in currFiles) {
      // Check if a file has been created
      if (!prevFiles[file] && currFiles[file]) {
        changes.push({
          path: file,
          event: FileEvent.Created,
        });
      }
    }

    prevFiles = currFiles;

    const end = Date.now();
    const wait = interval - (end - start);

    // Wait to make sure it runs the whole interval time
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));

    // If there was no changes continue to look for them else yield the changes
    if (changes.length === 0) {
      continue;
    } else {
      yield changes;
    }
  }
}
