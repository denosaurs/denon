// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { log } from "../deps.ts";

export function template(
  source: string,
  values: { [key: string]: string },
): string {
  return source.replace(/\${(\w*)}/, (match: string, key: string) => {
    if (values.key) {
      log.error(
        `Could not find key "${key}" in ${
          JSON.stringify(
            values,
          )
        } for template "${source}"`,
      );
    }

    return values[key];
  });
}
