import { walk } from "https://deno.land/std/fs/mod.ts";

export type FileModifiedMap = { [filename: string]: number };

export enum Event {
    Changed,
    Created,
    Removed
}

export interface Change {
    path: string;
    event: Event;
}

export interface WatchOptions {
    interval?: number;
    startFiles?: FileModifiedMap;

    maxDepth?: number;
    exts?: string[];
    match?: RegExp[];
    skip?: RegExp[];
}

export class Watcher implements AsyncIterator<Change[]> {
    private target: string;
    private interval: number;
    private prevFiles: FileModifiedMap;

    private maxDepth: number;
    private exts: string[];
    private match: RegExp[];
    private skip: RegExp[];

    constructor(
        target: string,
        {
            interval = 500,
            startFiles = {},

            maxDepth = Infinity,
            exts = null,
            match = null,
            skip = null
        }: WatchOptions = {}
    ) {
        this.target = target;
        this.interval = interval;
        this.prevFiles = startFiles;

        this.maxDepth = maxDepth;
        this.exts = exts;
        this.match = match;
        this.skip = skip;
    }

    public async next(): Promise<IteratorResult<Change[]>> {
        const currFiles: FileModifiedMap = {};
        const changes: Change[] = [];
        const start = Date.now();

        for await (const { filename, info } of walk(this.target, {
            maxDepth: this.maxDepth,
            includeDirs: false,
            followSymlinks: false,
            exts: this.exts,
            match: this.match,
            skip: this.skip
        })) {
            currFiles[filename] = info.modified;
        }

        for (const file in this.prevFiles) {
            if (this.prevFiles[file] && !currFiles[file]) {
                changes.push({
                    path: file,
                    event: Event.Removed
                });
            } else if (
                this.prevFiles[file] &&
                currFiles[file] &&
                this.prevFiles[file] !== currFiles[file]
            ) {
                changes.push({
                    path: file,
                    event: Event.Changed
                });
            }
        }

        for (const file in currFiles) {
            if (!this.prevFiles[file] && currFiles[file]) {
                changes.push({
                    path: file,
                    event: Event.Created
                });
            }
        }

        this.prevFiles = currFiles;

        const end = Date.now();
        const wait = this.interval - (end - start);

        if (wait > 0) await new Promise(r => setTimeout(r, wait));

        return changes.length === 0 ? this.next() : { done: false, value: changes };
    }
}

export function watch(target: string, options?: WatchOptions): AsyncIterable<Change[]> {
    const watcher = new Watcher(target, options);

    return {
        [Symbol.asyncIterator]() {
            return watcher;
        }
    };
}
