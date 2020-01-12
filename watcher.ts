import { walk } from "https://deno.land/std/fs/mod.ts";

export enum FileEvent {
    Changed,
    Created,
    Removed
}

export interface FileChange {
    path: string;
    event: FileEvent;
}

export interface WatchOptions {
    interval?: number;
    maxDepth?: number;
    exts?: string[];
    match?: RegExp[];
    skip?: RegExp[];
}

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
        const changes: FileChange[] = [];
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
