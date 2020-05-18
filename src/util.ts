// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log } from "../deps.ts";

/**
 * Applies values to a template of the default js template string format
 * @param source The source string to apply the values to
 * @param values An object from where the values originate
 */
export function template(
  source: string | string[],
  values: { [key: string]: undefined | string | string[] },
): string[] {
  if (typeof source === "string") {
    source = source.trim().replace(/\s\s+/g, " ");
    source = source.split(" ");
  }

  let output: string[] = [];

  for (const part of source) {
    const match = part.match(/^\${([a-zA-Z0-9_-]*)}$/);

    if (match?.[1]) {
      const key = match[1];

      if (Object.keys(values).includes(key)) {
        const value = values[key];

        if (value === undefined) {
          continue;
        }
        
        if (value instanceof Array) {
          output = output.concat(value);
        } else {
          output.push(value);
        }
      } else {
        log.warning(
          `Could not find key "${key}" in ${
            JSON.stringify(
              values,
            )
          } for template "${source}"`,
        );
      }
    } else {
      output.push(part);
    }
  }

  return output;
}
