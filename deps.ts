// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

// provide better logging, see src/log.ts
export * as log from "https://deno.land/std@0.57.0/log/mod.ts";
export { LogRecord } from "https://deno.land/std@0.57.0/log/logger.ts";
export {
  LogLevels,
  LevelName as LogLevelName,
} from "https://deno.land/std@0.57.0/log/levels.ts";
export { BaseHandler } from "https://deno.land/std@0.57.0/log/handlers.ts";

// colors for a pretty cli
export {
  setColorEnabled,
  reset,
  bold,
  blue,
  yellow,
  red,
  gray,
} from "https://deno.land/std@0.57.0/fmt/colors.ts";

// configuration reading
export {
  exists,
  existsSync,
  readFileStr,
  walk, // ... and one type of file monitoring
} from "https://deno.land/std@0.57.0/fs/mod.ts";

// configuration parsing (YAML)
export {
  JSON_SCHEMA,
  parse as parseYaml,
} from "https://deno.land/std@0.57.0/encoding/yaml.ts";

// file watching and directory matching
export {
  relative,
  dirname,
  extname,
  resolve,
  globToRegExp,
} from "https://deno.land/std@0.57.0/path/mod.ts";

// configuration parsing and writing (JSON)
export { readJson } from "https://deno.land/std@0.57.0/fs/read_json.ts";
export { writeJson } from "https://deno.land/std@0.57.0/fs/write_json.ts";

// event control
export { deferred, delay } from "https://deno.land/std@0.57.0/async/mod.ts";

// permission management
export { grant } from "https://deno.land/std@0.57.0/permissions/mod.ts";

// autocomplete
export * as omelette from "https://deno.land/x/omelette/omelette.ts";
