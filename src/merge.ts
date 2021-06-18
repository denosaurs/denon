// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

// deno-lint-ignore-file
export type Indexable = Record<string, any>;

/** Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays. */
export function merge<T extends Record<string, any>>(
  target: T,
  source: Indexable,
): T {
  const t = target as Record<string, unknown>;
  const isObject = (obj: unknown) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source as T;
  }

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      t[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      t[key] = merge(Object.assign({}, targetValue), sourceValue as Indexable);
    } else {
      t[key] = sourceValue;
    }
  }

  return t as T;
}
