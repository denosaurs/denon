// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

// provide better logging, see src/log.ts
export * as log from "https://deno.land/std@0.52.0/log/mod.ts";
export { LogRecord } from "https://deno.land/std@0.52.0/log/logger.ts";
export { LevelName as LogLevelName } from "https://deno.land/std@0.52.0/log/levels.ts";

export {
  setColorEnabled,
  reset,
  blue,
  yellow,
  gray,
  bold,
} from "https://deno.land/std@0.52.0/fmt/mod.ts";

export { parse as parseFlags } from "https://deno.land/std@0.52.0/flags/mod.ts";

export {
  exists,
  existsSync,
  readFileStr,
  walk,
} from "https://deno.land/std@0.52.0/fs/mod.ts";

export {
  JSON_SCHEMA,
  parse as parseYaml,
} from "https://deno.land/std@0.52.0/encoding/yaml.ts";

export {
  relative,
  dirname,
  extname,
  globToRegExp,
} from "https://deno.land/std@0.52.0/path/mod.ts";

export { readJson } from "https://deno.land/std@0.52.0/fs/read_json.ts";
export { writeJson } from "https://deno.land/std@0.52.0/fs/write_json.ts";

export { deferred, delay } from "https://deno.land/std@0.52.0/async/mod.ts";

export { grant } from "https://deno.land/std@0.52.0/permissions/mod.ts";
