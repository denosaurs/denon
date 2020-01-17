import { parse } from "https://deno.land/std/flags/mod.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import { dirname, resolve } from "https://deno.land/std/path/mod.ts";
import parry from "https://denolib.com/eliassjogreen/parry/mod.ts";
import { DenonConfig, DenonConfigDefaults, readConfig } from "./denonrc.ts";
import { debug, fail, setConfig } from "./log.ts";

export let config: DenonConfig = DenonConfigDefaults;
setConfig(config);

export async function denonWatcher(path: string, config: DenonConfig, args: string[]) {
    const { globToRegExp, extname } = await import("https://deno.land/std/path/mod.ts");

    const { watch, FileEvent } = await import("./watcher.ts");
    const { log, debug, setConfig } = await import("./log.ts");

    setConfig(config);

    const execute = (...args: string[]) => {
        let proc: Deno.Process | undefined;

        return () => {
            if (proc) {
                proc.close();
            }

            debug(`Running "${args.join(" ")}"`);
            proc = Deno.run({
                args: args
            });
        };
    };

    const executors: { [extension: string]: { [file: string]: () => void } } = {};

    for (const extension in config.execute) {
        executors[extension] = {};

        for (const file of config.files) {
            if (extname(file) === extension) {
                executors[extension][file] = execute(...config.execute[extension], file, ...args);
                executors[extension][file]();
            }
        }
    }

    log(`Watching ${path}`);
    for await (const changes of watch(path, {
        interval: config.interval,
        exts: config.extensions,
        match: config.match ? config.match.map(v => globToRegExp(v)) : undefined,
        skip: config.skip ? config.skip.map(v => globToRegExp(v)) : undefined
    })) {
        // if (config.fullscreen) {
        //     console.clear();
        // }

        log(`Detected ${changes.length} change${changes.length > 1 ? "s" : ""}. Rerunning...`);

        for (const change of changes) {
            debug(`File "${change.path}" was ${FileEvent[change.event].toLowerCase()}`);
        }

        for (const extension in config.execute) {
            for (const file of config.files) {
                if (executors[extension][file]) {
                    executors[extension][file]();
                }
            }
        }
    }
}

const help = () =>
    console.log(`
Usage:
    denon [options] [script] [-- <your_args>]

Options:
    -c, --config <file>     A path to a config file, defaults to [default: .denonrc | .denonrc.json]
    -d, --debug             Debugging mode for more verbose logging
    -e, --extensions        List of extensions to look for separated by commas
    -f, --fullscreen        Clears the screen each reload
    -h, --help              Prints this
    -i, --interval <ms>     The number of milliseconds between each check
    -m, --match <glob>      Glob pattern for all the files to match
    -q, --quiet             Turns off all logging
    -s, --skip <glob>       Glob pattern for ignoring specific files or directories
    -w, --watch             List of paths to watch separated by commas
`);

if (import.meta.main) {
    const flags = parse(Deno.args, {
        string: ["config", "extensions", "interval", "match", "skip", "watch"],
        boolean: ["debug", "fullscreen", "help", "quiet"],
        alias: {
            config: "c",
            debug: "d",
            extensions: "e",
            fullscreen: "f",
            help: "h",
            interval: "i",
            match: "m",
            quiet: "q",
            skip: "s",
            watch: "w"
        },
        "--": true
    });

    if (flags.debug) {
        config.debug = flags.debug;
    }

    if (flags.help) {
        debug("Printing help...");
        help();
        Deno.exit(0);
    }

    if (flags.config) {
        debug(`Reading config from ${flags.config}`);
        config = await readConfig(flags.config);
    } else {
        debug(`Reading config from .denonrc | .denonrc.json`);
        config = await readConfig();
    }

    if (flags.extensions) {
        config.extensions = flags.extensions.split(",");
    }

    if (flags.fullscreen) {
        config.fullscreen = flags.fullscreen;
    }

    if (flags.interval) {
        config.interval = parseInt(flags.interval);
    }

    if (flags.match) {
        config.match = [flags.match];
    }

    if (flags.watch) {
        config.watch = flags.watch.split(",");
    }

    if (flags.quiet) {
        config.quiet = flags.quiet;
    }

    if (flags.skip) {
        config.skip = [flags.skip];
    }

    if (config.files.length < 1) {
        if (flags._.length < 1 || !(await exists(flags._[0]))) {
            fail("Could not start denon because no file was provided, use -h for help");
        }
    }

    if (!(await exists(flags._[0]))) {
        fail("Could not start denon because file does not exist");
    } else {
        const file = resolve(flags._[0]);

        config.files.push(file);
        config.watch.push(dirname(file));
    }

    const watchers: Promise<void>[] = [];

    debug("Creating watchers");
    for (const path of config.watch) {
        if (!(await exists(path))) {
            fail(`Can not watch directory ${path} because it does not exist`);
        }

        debug(`Creating watcher for path "${path}"`);
        watchers.push(parry(denonWatcher)(path, config, flags["--"]));
    }

    Promise.all(watchers);
}
