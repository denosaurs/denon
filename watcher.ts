import { walk } from "https://deno.land/std/fs/mod.ts";

/** All of the types of changes that a file can have */
export enum FileEvent {
    /** The file was changed */
    Changed,
    /** The file was created */
    Created,
    /** The file was remove */
    Removed
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
        exts = null,
        match = null,
        skip = null
    }: WatchOptions = {}
): AsyncGenerator<FileChange[]> {
    let prevFiles = {};

    for await (const { filename, info } of walk(target, {
        maxDepth: maxDepth,
        includeDirs: false,
        followSymlinks: false,
        exts: exts,
        match: match,
        skip: skip
    })) {
        prevFiles[filename] = info.modified;
    }

    while (true) {
        const currFiles = {};
        const changes = [];
        const start = Date.now();

        for await (const { filename, info } of walk(target, {
            maxDepth: maxDepth,
            includeDirs: false,
            followSymlinks: false,
            exts: exts,
            match: match,
            skip: skip
        })) {
            currFiles[filename] = info.modified;
        }

        for (const file in prevFiles) {
            if (prevFiles[file] && !currFiles[file]) {
                console.log(file);

                changes.push({
                    path: file,
                    event: FileEvent.Removed
                });
            } else if (prevFiles[file] && currFiles[file] && prevFiles[file] !== currFiles[file]) {
                changes.push({
                    path: file,
                    event: FileEvent.Changed
                });
            }
        }

        for (const file in currFiles) {
            if (!prevFiles[file] && currFiles[file]) {
                changes.push({
                    path: file,
                    event: FileEvent.Created
                });
            }
        }

        prevFiles = currFiles;

        const end = Date.now();
        const wait = interval - (end - start);

        if (wait > 0) await new Promise(r => setTimeout(r, wait));

        if (changes.length === 0) {
            continue;
        } else {
            yield changes;
        }
    }
}
