import { dirname, exists, extname, resolve, grant } from "./deps.ts";
import { parseArgs, help, applyIfDefined } from "./cli.ts";
import {
  DenonConfig,
  DenonConfigDefaults,
  readConfig,
} from "./denon_config.ts";
import { debug, log, fail, setConfig } from "./log.ts";
import Watcher from "./watcher.ts";

export let config: DenonConfig = DenonConfigDefaults;
setConfig(config);

if (import.meta.main) {
  const flags = parseArgs(Deno.args);

  if (flags.debug) {
    config.debug = flags.debug;
    debug("Debug enabled!");
  }

  const permissions = await grant({ name: "read" }, { name: "run" });

  if (permissions && permissions.length >= 2) {
    debug(`Required permissions "read" and "run" granted`);
  } else {
    fail(`Required permissions "read" and "run" not granted`);
  }

  if (flags.config) {
    debug(`Reading config from ${flags.config}`);
    config = await readConfig(flags.config);
  } else {
    debug(
      `Reading config from .denon | .denon.json | .denonrc | .denonrc.json`,
    );
    config = await readConfig();
  }

  debug(`Read config: ${JSON.stringify(config)}`);

  debug(`Args: ${Deno.args}`);
  debug(`Flags: ${JSON.stringify(flags)}`);

  if (flags.help) {
    debug("Printing help...");
    help();
    Deno.exit(0);
  }

  applyIfDefined(
    config,
    flags,
    [
      "deno_args",
      "extensions",
      "fullscreen",
      "interval",
      "match",
      "quiet",
      "skip",
      "watch",
      "fmt",
      "test",
    ],
  );

  debug(`Config: ${JSON.stringify(config)}`);

  if (config.fmt || config.test) {
    const cwd = Deno.cwd();
    debug(`Added watcher for "${cwd}" because of fmt or test config`);
    config.watch.push(cwd);
  } else if (config.files.length < 1 && flags.files.length < 1) {
    fail(
      "Could not start denon because no file was provided, use -h for help",
    );
  }

  for (const file of flags.files) {
    if (!(await exists(file))) {
      fail(`Could not start denon because file "${file}" does not exist`);
    }

    const filePath = resolve(file);
    config.files.push(filePath);
    if (!config.watch.length) {
      config.watch.push(dirname(filePath));
    }
  }

  const tmpFiles = [...config.files];
  config.files = [];

  for (const file of tmpFiles) {
    if (!(await exists(file))) {
      fail(`Could not start denon because file "${file}" does not exist`);
    }
    const filepath = resolve(file);
    const fileInfo = await Deno.lstat(filepath);
    if (fileInfo.isDirectory) {
      fail(`Could not start denon because "${file}" is a directory`);
    }

    config.files.push(filepath);
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

  const executors: (() => void)[] = [];
  const execute = (...args: string[]) => {
    let proc: Deno.Process | undefined;

    return () => {
      if (proc) {
        proc.close();
      }

      debug(`Running "${args.join(" ")}"`);
      proc = Deno.run({
        cmd: args,
      });
    };
  };

  if (config.fullscreen) {
    debug("Adding fullscreen executor");
    executors.push(() => {
      debug("Clearing screen");
      console.clear();
    });
  }

  if (config.fmt) {
    debug("Adding deno fmt executor");
    executors.push(execute("deno", "fmt"));
  }

  if (config.test) {
    debug("Adding deno test executor");
    executors.push(execute("deno", "test"));
  }

  for (const file of config.files) {
    const extension = extname(file);
    const cmds = config.execute[extension] as string[] | undefined;

    if (cmds) {
      const binary = cmds[0];

      const executor = execute(
        ...cmds,
        ...(binary === "deno" ? flags.deno_args : []),
        file,
        ...flags.runnerFlags,
      );

      executors.push(executor);
    } else {
      fail(`Can not run ${file}. No config for "${extension}" found`);
    }
  }

  debug("Initial execution of executors");
  executors.forEach((ex) => ex());

  debug("Creating watchers");
  for (const path of config.watch) {
    if (!(await exists(path))) {
      fail(`Can not watch directory ${path} because it does not exist`);
    }
  }

  debug(`Creating watcher for paths "${config.watch}"`);
  const watcher = new Watcher(config.watch, {
    interval: config.interval,
    exts: config.extensions,
    match: config.match,
    skip: config.skip,
  });

  log(`Watching ${config.watch.join(", ")}`);
  for await (const changes of watcher) {
    log(
      `Detected ${changes.length} change${
        changes.length > 1 ? "s" : ""
      }. Rerunning...`,
    );

    for (const change of changes) {
      debug(`File "${change.path}" was ${change.event}`);
    }

    executors.forEach((ex) => ex());
  }
}
