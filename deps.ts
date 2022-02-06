// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

// provide better logging, see src/log.ts
export * as log from "https://deno.land/x/branch@0.1.6/mod.ts";

// colors for a pretty cli
export {
  blue,
  bold,
  gray,
  green,
  italic,
  red,
  reset,
  setColorEnabled,
  yellow,
} from "https://deno.land/std@0.125.0/fmt/colors.ts";

// configuration reading
export {
  exists,
  existsSync,
  walk, // ... and one type of file monitoring
} from "https://deno.land/std@0.125.0/fs/mod.ts";

// configuration parsing (YAML)
export {
  JSON_SCHEMA,
  parse as parseYaml,
} from "https://deno.land/std@0.125.0/encoding/yaml.ts";

// file watching and directory matching
export {
  dirname,
  extname,
  globToRegExp,
  relative,
  resolve,
} from "https://deno.land/std@0.125.0/path/mod.ts";

// event control
export { deferred, delay } from "https://deno.land/std@0.125.0/async/mod.ts";

// permission management
export { grant } from "https://deno.land/std@0.125.0/permissions/mod.ts";
