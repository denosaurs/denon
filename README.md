![denom](https://raw.githubusercontent.com/denosaurs/denon/master/.assets/denom.svg)

# denon

[![stars](https://img.shields.io/github/stars/denosaurs/denon)](https://github.com/denosaurs/denon/stargazers)
[![workflow](https://img.shields.io/github/workflow/status/denosaurs/denon/test?logo=github)](https://github.com/denosaurs/denon/actions)
[![releases](https://img.shields.io/github/v/release/denosaurs/denon?logo=github)](https://github.com/denosaurs/denon/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-^1.0.1-informational?logo=deno)](https://github.com/denoland/deno)
[![deno doc](https://img.shields.io/badge/deno-doc-informational?logo=deno)](https://doc.deno.land/https/deno.land/x/denon/mod.ts)
[![Discord](https://img.shields.io/discord/713043818806509608?logo=discord&logoColor=white)](https://discord.gg/shHG8vg)
[![license](https://img.shields.io/github/license/denosaurs/denon)](https://github.com/denosaurs/denon/blob/master/LICENSE)
[![issues](https://img.shields.io/github/issues/denosaurs/denon)](https://github.com/denosaurs/denon/issues)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2231b4b5f746484ebeaaf95eb6433ce5)](https://app.codacy.com/gh/denosaurs/denon?utm_source=github.com&utm_medium=referral&utm_content=denosaurs/denon&utm_campaign=Badge_Grade_Dashboard)

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
$ deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts
```

> ⚠️ Make sure you are using `deno` version `^1.0.1` to install this executable. You can upgrade running `deno upgrade`.

## Usage

denon wraps your application, so you can pass all the arguments you would normally pass to your app:

```bash
$ denon run app.ts
```

you can pass arguments to deno:

```bash
$ denon run --allow-env app.ts
```

and even to your application:

```bash
$ denon run --allow-env app.ts --arg-for-my-app
```

you can run scripts declared in config:

```bash
$ denon [script name]
```

and you can see which script are available in your config:

```bash
$ denon
```

to see what else you can do with deno CLI use the help flag:

```bash
$ denon --help
```

## Autocompletion

In **zsh**, you can install autocompletion with:

```bash
echo '. <(denon --completion)' >> ~/.zshrc
```

In **bash**:

```bash
denon --completion >> ~/.config/denon.completion.sh
echo 'source ~/.config/denon.completion.sh' >> ~/.bash_profile
```

In **fish**:

```bash
echo 'denon --completion-fish | source' >> ~/.config/fish/config.fish
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

### JSON Schema

You can use a JSON schema to have type checking on your configuration. Simply add:

```jsonc
{
  "$schema": "https://deno.land/x/denon/schema.json",
  "scripts": { /* */ }
}
```

> ⚠️ This feature going under development, so it might change

### Available options

denon takes inspiration from the awesome [velociraptor](https://github.com/umbopepato/velociraptor) module in the way it handles scripts.

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
        "write",
      ],
      "unstable": true

      // running `denon start` will resolve in
      // deno run --allow-env --allow-write --unstable app.ts
    }
  }
}
```

### Script Options

Options can be script specific or be declared as global in the root of the config file.

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

Load import map file. Take a look a at the [official docs](https://deno.land/manual/linking_to_external_code/import_maps) for additional info.

> ⚠️ This feature in unstable in the current version of the deno executable.

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

Load tsconfig.json configuration file:

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

#### Unstable

Enable if the script is using unstable features of deno stdlib:

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "unstable": true
    }
  }
}
```

#### Inspect and InspectBrk

Activate inspector on `host:port`. If `inspectBrk` is used the executions breaks at the start of the user script:

```jsonc
{
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "Run the main server.",

      "inspect": "127.0.0.1:9229",
      // OR
      "inspectBrk": "127.0.0.1:9229"
    }
  }
}
```

#### Lockfile

Check the specified lock file:

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

#### Cert

Load certificate authority from PEM encoded file:

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

#### Log

Set log level: (possible values: `debug`, `info`)

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

### Watcher

File watcher options:

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
    "legacy": false
  }
}
```

### Logger

Internal logger options:

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

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and commit messages are done following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
