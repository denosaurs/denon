// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

/**
 * Reimplementation of Object.assign() that discards
 * `undefined` values.
 * @param target to witch assing
 * @param sources to witch copy from
 */
export function merge<T extends Record<string, any>>(
  target: T,
  ...sources: any
): T {
  const t = target as Record<string, any>;
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        t[key] = val;
      }
    }
  }
  return t as T;
}
