# Denon

Like [nodemon](https://nodemon.io/), but made in [deno](https://deno.land/).
[(Also a deno style file watcher)](https://github.com/eliassjogreen/denon/blob/master/watcher.ts)

## Install

To install denon simply enter the following into a terminal:

`deno install denon https://deno.land/x/denon/denon.ts --allow-read --allow-run --allow-net` 

## Usage

To use denon simply think of `denon` as an alternative to `deno run` which accepts all the same flags if no
flags or configuration has been set.

``` 
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
```

## Configuration

Denon supports local configuration files. The default filenames for these are `.denonrc` or `.denonrc.json` and
are written in json. They can also be specified by using the `--config <file>` flag. These configuration allow for
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
        "js",
        "ts",
        "py",
        "json"
    ],
    "match": [
        "*.ts"
    ],
    "skip": [
        "*_test.ts",
        "*_test.js"
    ],
    "interval": 500,
    "watch": [
        "source/",
        "tools/"
    ],
    "execute": {
        ".js": ["deno", "run"],
        ".ts": ["deno", "run"],
        ".py": ["python"]
    }
}
```

## Todo

-   [x] Help dialog
-   [x] Configuration flags
-   [x] Configuration file.
-   [x] Non-deno scripts
-   [x] Mapping file extensions to certain scripts
-   [x] Multiple directories
-   [x] Using denon from deno
-   [ ] "Fullscreen" mode using console.clear each time its rerun (console.clear does not seem to be implemented for Workers)
-   [ ] Tests
