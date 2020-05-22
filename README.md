# denon

[![license](https://img.shields.io/github/license/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/blob/master/LICENSE)
[![stars](https://img.shields.io/github/stars/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/stargazers)
[![issues](https://img.shields.io/github/issues/eliassjogreen/denon)](https://github.com/eliassjogreen/denon/issues)
[![ci](https://github.com/eliassjogreen/denon/workflows/test/badge.svg)](https://github.com/eliassjogreen/denon/actions)
[![releases](https://img.shields.io/github/downloads/eliassjogreen/denon/total)](https://github.com/eliassjogreen/denon/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-1.0.1-informational)](https://github.com/denoland/deno)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/denon/mod.ts)

denon is the [deno](https://deno.land/) replacement for [nodemon](https://nodemon.io/) providing a feature packed and easy to use experience.

denon does **not** require *any* additional changes to your code or method of development. `denon` is a replacement wrapper for `deno`. To use `denon`,replace the word `deno` on the command line when executing your script.

## Features

Denon provides most of the features you would expect of a file watcher and more.

- Automatically restart your deno projects
- Drop-in replacement for `deno` executable
- Extensive configuration options with script support
- Configurable file watcher with support for filesystem events and directory walking
- Ignoring specific files or directories with [glob](<https://en.wikipedia.org/wiki/Glob_(programming)>) patterns
- Not limited to deno projects with a powerful script configuration

## Install

To install denon simply enter the following into a terminal:

```bash
$ deno install -Af --unstable https://deno.land/x/denon/denon.ts
```

## Usage

denon wraps your application, so you can pass all the arguments you would normally pass to your app:

```bash
$ denon run app.ts
```

you can pass arguments to deno:

```bash
$ denon --allow-env run app.ts
```

and even to your application:

```bash
$ denon --allow-env run app.ts 8080
```

you can run scripts declared in config:

```bash
$ denon <script name>
```

and you can see which script are available in your config:

```bash
$ denon
```

to see what else you can do with deno CLI use the help flag:

```bash
$ denon --help
```

## Configuration

denon is designed to be simple but also extremely configurable to fit your project needs. It supports both json and yaml for the configuration file. The configuration options in yaml is the same as json making it compatible.

to create a basic configuration in the root directory of your project file you can run:

```bash
$ denon --init
```

this will create a basic `denon.json` file:

```jsonc
{
  "scripts": {
    "start": "app.js"
  }
}
```

### Available options

denon takes inspiration from the awesome `velociraptor` module in the way it handles scripts

#### Scripts

Scripts are declared inside the `scripts` object and are identified by a name:

```jsonc
{
  "scripts": {
    // they all resolve to `deno run app.ts` when you run `denon start`
    "start": "app.ts",
    // OR
    "start": "run app.ts",
    // OR
    "start": "deno run app.ts"
  }
}
```

Scripts can also be defined by a complex object:

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      // with an optional description that
      // is shown when you run `denon` to list
      // all the scripts
      "desc": "Run the main server.",

      // available options...
      // they are described in the next paragraph
      "allow": [
        "env",
        "watch",
      ],
      "unstable": true

      // running `denon start` will resolve in
      // deno run --allow-env --allow-watch --unstable app.ts
    }
  }
}
```

### Script Options

Options can be script specific or be declared as global in the root of the config file. Script options are greatly inspired by the [velociraptor](https://github.com/umbopepato/velociraptor).

#### Environment variables

Environment variables can be provided as an object and are passed directly to the child process.

```jsonc
{
  // globally applied to all scripts
  "env": {
    "TOKEN": "SUPER SECRET TOKEN",
  },

  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "env": {
        "PORT": 3000
      }
    }
  }
}
```

#### Permissions

Permission can be granted to child processes.

```jsonc
{
  // globally applied to all scripts
  "allow": {
    "read": "/etc", // --allow-read=/etc
    "env": true     // --allow-env
  },

  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "allow": [
        "run", // --allow-run
        "net", // --allow-net
      ]
    }
  }
}
```

#### Import Map

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "importmap": "importmap.json"
    }
  }
}
```

#### TS config

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "tsconfig": "tsconfig.json"
    }
  }
}
```

#### Inspect and InspectBrk

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "inspect": "localhost:9229",
      // OR
      "inspectBrk": "localhost:9229"
    }
  }
}
```

#### Lockfile

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "lock": "lock.json"
    }
  }
}
```

#### Log

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "log": "debug" // or "info"
    }
  }
}
```

#### Cert

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "cert": "cert.pem"
    }
  }
}
```

### Watcher

```jsonc
{
  "scripts": { /* */ },

  "watcher": {
    // The number of milliseconds after the last change.
    "interval": 350,
    // The file extensions that it will scan for.
    "exts": ["js", "ts", "json"],
    // The globs that it will scan for.
    "match": ["*.*"],
    // The globs that it will not scan for.
    "skip": ["*/.git/*"],
    // Use the legacy file monitoring algorithm. (walking)
    "legacy": false;
  }
}
```

### Logger

```jsonc
{
  "scripts": { /* */ },

  "logger": {
    // Clear screen after every restart.
    "fullscreen": false,
    // Output only errors
    "quiet": false,
    // Output debug messages
    "debug": true,
  }
}
```

## Other

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt`.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
