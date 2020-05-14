# Denon

[![license](https://img.shields.io/github/license/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/blob/master/LICENSE)
[![stars](https://img.shields.io/github/stars/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/stargazers)
[![issues](https://img.shields.io/github/issues/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/issues)
[![ci](https://github.com/eliassjogreen/denon/workflows/test/badge.svg)](https://github.com/eliassjogreen/denon/actions)
[![releases](https://img.shields.io/github/downloads/eliassjogreen/denon/total)](https://github.com/eliassjogreen/denon/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-1.0.0-success)](https://github.com/denoland/deno)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/denon/mod.ts)

Denon aims to be the [deno](https://deno.land/) replacement for [nodemon](https://nodemon.io/) providing a feature packed and easy to use experience.

## Features

Denon provides most of the features you would expect of a file watcher and more.

* Automatic restarting of deno application
* Default support for `deno run` making it as easy as replacing `deno` with `denon` to run your code
* Aliases for `deno run`, `deno fmt` and `deno test`
* An extensive configuration file
* Watching of specific directories
* [Glob](https://en.wikipedia.org/wiki/Glob_(programming)) matching for watched files and directories
* Watching of only certain extensions
* Set interval matching for good performance and not spamming executors
* Specific executors for specific file types (e.g. `denon file.py` would work with the right configuration)

## Install

To install denon simply enter the following into a terminal:

`deno install -Af --unstable https://deno.land/x/denon/denon.ts`

## Usage

To use denon simply think of `denon` as an alternative to `deno run` which accepts all the same flags if no
flags or configuration has been set.

```
Usage:
    denon [COMMANDS] [OPTIONS] [DENO_ARGS] [SCRIPT] [-- <SCRIPT_ARGS>]

OPTIONS:
    -c, --config <file>     A path to a config file, defaults to [default: .denon | .denon.json | .denonrc | .denonrc.json]
    -d, --debug             Debugging mode for more verbose logging
    -e, --extensions        List of extensions to look for separated by commas
    -f, --fullscreen        Clears the screen each reload
    -h, --help              Prints this
    -i, --interval <ms>     The number of milliseconds between each check
    -m, --match <glob>      Glob pattern for all the files to match
    -q, --quiet             Turns off all logging
    -s, --skip <glob>       Glob pattern for ignoring specific files or directories
    -w, --watch             List of paths to watch separated by commas
        --fmt               Adds a deno fmt executor
        --test              Adds a deno test executor

COMMANDS:
    fmt                     Alias for flag --fmt
    test                    Alias for flag --test

DENO_ARGS: Arguments passed to Deno to run SCRIPT (like permisssions)
```

## Configuration

Denon supports local configuration files. The default filenames for these are `.denon`, `.denon.json`, `.denonrc`, `.denonrc.json`  and
are written in json. They can also be specified by using the `--config <file>` flag. These configuration files allow for
even more features then the command line flags although command line flags always overrides the configuration file
options. All of the options in the configuration file are optional and will be set to their default if nothing else
is specified.

Example configuration with all of the possible configuration values set to something:

``` json
{
    "files": [
        "main.ts"
    ],
    "quiet": false,
    "debug": true,
    "fullscreen": true,
    "extensions": [
        ".js",
        ".ts",
        ".py",
        ".json"
    ],
    "interval": 500,
    "watch": [
        "source/",
        "tools/"
    ],
    "deno_args":[
        "--allow-net",
        "--import-map=import-map.json"
    ],
    "execute": {
        ".js": ["deno", "run"],
        ".ts": ["deno", "run"],
        ".py": ["python"]
    },
    "fmt": false,
    "test": true
}
```

## Contributing

Contributions are very welcome! Just remember to run `deno fmt` to keep the style consistent.
