import { parse } from "https://deno.land/std/flags/mod.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import {
    dirname,
    resolve,
    globToRegExp,
    extname
} from "https://deno.land/std/path/mod.ts";
import { mux } from "https://denolib.com/kt3k/mux-async-iterator/mod.ts";
import { DenonConfig, DenonConfigDefaults, readConfig } from "./denonrc.ts";
import { debug, log, fail, setConfig } from "./log.ts";
import { watch, FileEvent, FileChange } from "./watcher.ts";

export let config: DenonConfig = DenonConfigDefaults;
setConfig(config);

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
    const args = [...Deno.args];
    if (args[0] === "--") {
        args.shift();
    }

    const flags = parse(args, {
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

    if (flags.config) {
        debug(`Reading config from ${flags.config}`);
        config = await readConfig(flags.config);
    } else {
        debug(`Reading config from .denonrc | .denonrc.json`);
        config = await readConfig();
    }

    setConfig(config);

    debug(`Args: ${args}`);
    debug(`Flags: ${JSON.stringify(flags)}`);

    if (flags.help) {
        debug("Printing help...");
        help();
        Deno.exit(0);
    }

    debug(`Config: ${JSON.stringify(config)}`);

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
            fail(
                "Could not start denon because no file was provided, use -h for help"
            );
        }
    }

    if (flags._[0]) {
        if (!(await exists(flags._[0]))) {
            fail("Could not start denon because file does not exist");
        } else {
            const file = resolve(flags._[0]);

            config.files.push(file);
            config.watch.push(dirname(file));
        }
    }

    const tmpFiles = [...config.files];
    config.files = [];

    for (const file of tmpFiles) {
        if (!(await exists(file))) {
            fail(`Could not start denon because file "${file}" does not exist`);
        }

        config.files.push(resolve(file));
    }

    // Remove duplicates
    config.files = [...new Set(config.files)];
    debug(`Files: ${config.files}`);

    const tmpWatch = [...config.watch];
    config.watch = [];

    for (const path of tmpWatch) {
        if (!(await exists(path))) {
            fail(`Could not start denon because path "${path}" does not exist`);
        }

        config.watch.push(resolve(path));
    }

    // Remove duplicates
    config.watch = [...new Set(config.watch)];
    debug(`Paths: ${config.watch}`);

    const watchers: AsyncGenerator<FileChange[], any, unknown>[] = [];
    const runnerFlags = flags["--"] ? flags["--"] : [];
    const executors: {
        [extension: string]: { [file: string]: () => void };
    } = {};

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

    for (const extension in config.execute) {
        executors[extension] = {};

        for (const file of config.files) {
            if (extname(file) === extension) {
                executors[extension][file] = execute(
                    ...config.execute[extension],
                    file,
                    ...runnerFlags
                );

                if (config.fullscreen) {
                    console.clear();
                }

                executors[extension][file]();
            }
        }
    }

    debug("Creating watchers");
    for (const path of config.watch) {
        if (!(await exists(path))) {
            fail(`Can not watch directory ${path} because it does not exist`);
        }

        debug(`Creating watcher for path "${path}"`);

        watchers.push(
            watch(path, {
                interval: config.interval,
                exts: config.extensions,
                match: config.match
                    ? config.match.map(v => globToRegExp(v))
                    : undefined,
                skip: config.skip
                    ? config.skip.map(v => globToRegExp(v))
                    : undefined
            })
        );
    }

    const multiplexer = mux(...watchers);

    log(`Watching ${config.watch.join(", ")}`);
    for await (const changes of multiplexer) {
        if (config.fullscreen) {
            debug("Clearing screen");
            console.clear();
        }

        log(
            `Detected ${changes.length} change${
                changes.length > 1 ? "s" : ""
            }. Rerunning...`
        );

        for (const change of changes) {
            debug(
                `File "${change.path}" was ${FileEvent[
                    change.event
                ].toLowerCase()}`
            );
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
