import { parse } from "https://deno.land/std/flags/mod.ts";
import { resolve, dirname, globToRegExp } from "https://deno.land/std/path/mod.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import { yellow, green, red, setColorEnabled } from "https://deno.land/std/fmt/mod.ts";
import { watch, FileEvent } from "./watcher.ts";

interface DenonOptions {
    debug?: boolean;
    interval?: number;
    maxDepth?: number;
    exts?: string[];
    match?: RegExp[];
    skip?: RegExp[];
}

const parseOptions = {
    boolean: ["d", "debug"],
    alias: {
        "debug": "d",
        "extensions": ["e", "exts"],
        "match": "m",
        "skip": "s",
        "interval": "i"
    },
    default: {
        "debug": false,
        "maxdepth": Infinity,
        "extensions": null,
        "match": null,
        "skip": null,
        "interval": 500
    }
};

if (!Deno.noColor) setColorEnabled(true);
const allArgs = [...Deno.args];
const allFlags = parse(allArgs, parseOptions);

if (allFlags._.length < 1 || !(await exists(allFlags._[0]))) {
    fail("Could not start denon because no file was provided");
}

const denonArgs = allArgs.slice(0, allArgs.indexOf(allFlags._[0]) + 1);
const denoArgs = allArgs.splice(allArgs.indexOf(allFlags._[0]) + 1);

const flags = parse(denonArgs, parseOptions);

const options: DenonOptions = {
    debug: flags.debug,
    maxDepth: flags.maxDepth,
    exts: flags.extensions ? flags.extensions.split(",") : null,
    match: flags.match ? [globToRegExp(flags.match)] : null,
    skip: flags.skip ? [globToRegExp(flags.skip)] : null,
    interval: flags.interval
};

const file = resolve(flags._[0]);
const path = dirname(file);
const runner = run();

log(`Watching ${path}, Running...`);

runner();

for await (const changes of watch(path, {
    interval: options.interval,
    maxDepth: options.maxDepth,
    exts: options.exts,
    match: options.match,
    skip: options.skip
})) {
    log(`Detected ${changes.length} change${changes.length > 1 ? "s" : ""}. Rerunning...`);

    for (const change of changes) {
        debug(`File "${change.path}" was ${FileEvent[change.event].toLowerCase()}`);
    }

    runner();
}

function run() {
    let proc: Deno.Process | undefined;

    return () => {
        if (proc) {
            proc.close();
        }

        debug(`Running "${["deno", "run", file, ...denoArgs].join(" ")}"`);

        proc = Deno.run({
            args: ["deno", "run", file, ...denoArgs]
        });
    };
}

function fail(reason: string, code: number = 1) {
    console.log(red(`[DENON] ${reason}`));
    Deno.exit(code);
}

function log(text: string) {
    console.log(green(`[DENON] ${text}`));
}

function debug(text: string) {
    if (options.debug) console.log(yellow(`[DENON] ${text}`));
}

function help() {}
