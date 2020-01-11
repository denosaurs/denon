import { walk, WalkOptions } from "https://deno.land/std/fs/mod.ts";

export enum Event {
    Changed,
    Created,
    Removed
}

export interface Change {
    path: string;
    event: Event;
}

export interface WatchOptions extends WalkOptions {
    interval: number;
}

export class Watcher implements AsyncIterator<Change[]> {
    public files: { [file: string]: number } = {};
    public target: string;
    public options: WatchOptions;

    private previous: number;

    constructor(
        target: string,
        options: WatchOptions = {
            interval: 500
        },
        files: { [file: string]: number } = {}
    ) {
        this.files = files;
        this.target = target;
        this.options = options;

        this.previous = Date.now();
    }

    private difference(
        a: { [key: string]: number },
        b: { [key: string]: number }
    ): {
        created: {};
        removed: {};
        changed: {};
    } {
        const difference = {
            created: {},
            removed: {},
            changed: {}
        };

        for (const key in a) {
            if (a[key] && !b[key]) {
                difference.removed[key] = a[key];
            } else if (a[key] && b[key] && a[key] !== b[key]) {
                difference.changed[key] = b[key];
            }
        }

        for (const key in b) {
            if (!a[key] && b[key]) {
                difference.created[key] = b[key];
            }
        }

        return difference;
    }

    public async next(): Promise<IteratorResult<Change[]>> {
        const newFiles: { [file: string]: number } = {};
        const changes: Change[] = [];

        for await (const { filename, info } of walk(this.target, this.options)) {
            if (info.isFile()) {
                newFiles[filename] = info.modified;
            }
        }

        const { created, removed, changed } = this.difference(this.files, newFiles);

        for (const key in created) {
            changes.push({
                path: key,
                event: Event.Created
            });
        }

        for (const key in removed) {
            changes.push({
                path: key,
                event: Event.Removed
            });
        }

        for (const key in changed) {
            changes.push({
                path: key,
                event: Event.Changed
            });
        }

        this.files = newFiles;

        while (true) {
            const time = Date.now();
            if (this.previous + this.options.interval <= time) {
                this.previous = time;
                break;
            }
        }

        return changes.length === 0 ? this.next() : { done: false, value: changes };
    }
}

export async function watch(target: string, options?: WatchOptions): Promise<AsyncIterable<Change[]>> {
    const files: { [file: string]: number } = {};

    for await (const { filename, info } of walk(target, options)) {
        if (info.isFile()) {
            files[filename] = info.modified;
        }
    }

    const watcher = new Watcher(target, options, files);

    return {
        [Symbol.asyncIterator]() {
            return watcher;
        }
    };
}
