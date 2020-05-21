// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 */
export function merge<T extends Record<string, any>>(
  target: T,
  source: any,
): T {
  const t = target as Record<string, any>;
  const isObject = (obj: any) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      t[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      t[key] = merge(Object.assign({}, targetValue), sourceValue);
    } else {
      t[key] = sourceValue;
    }
  }

  return t as T;
}
