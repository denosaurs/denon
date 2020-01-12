# Denon

Like Nodemon, but for Deno.
[(Also a deno style file watcher)](https://github.com/eliassjogreen/denon/blob/master/watcher.ts)

## Install

To install Denon simply enter the following into a terminal:

```deno install . denon https://denolib.com/eliassjogreen/denon/denon.ts --allow-read --allow-run -- -- --```

Yeah the last part is funky but it works at least...

## Usage

To use Denon simply think of `denon` as an alternative to `deno run` which accepts all the same flags

```
Usage:
    denon [OPTIONS] [SCRIPT] [<OTHER>...]

Options:
    -h, --help          Prints this
    -d, --debug         Debugging mode for more verbose logging
    -e, --extensions    List of extensions to look for separated by commas
    -m, --match         Glob pattern for all the files to match
    -s, --skip          Glob pattern for ignoring specific files or directories
    -i, --interval      The number of milliseconds between each check
```

## Todo

- [x] Help dialog
- [x] Configuration flags
- [ ] Configuration file?
- [ ] Non-deno scripts
- [ ] Mapping file extensions to certain scripts
- [ ] Multiple directories
- [ ] Using denon from deno
- [ ] "Fullscreen" mode using console.clear each time its rerun
- [ ] Tests
