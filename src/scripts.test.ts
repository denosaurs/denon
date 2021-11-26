// Copyright 2020-2021 the denosaurs team. All rights reserved. MIT license.

import { buildFlags, ScriptOptions } from "./scripts.ts";
import { assert, assertEquals } from "../test_deps.ts";

Deno.test({
  name: "scripts | flags",
  fn: () => {
    const options: ScriptOptions = {
      watch: false, // not going to show up
      allow: ["net", "env", "write"],
      cert: "secure.pem",
      env: {
        SECRET: "123", // not going to show up
      },
      importMap: "cool.code.json",
      inspect: "127.0.0.1:4321",
      inspectBrk: "127.0.0.1:1234",
      lock: "lock.json",
      log: "info",
      stderr: "inherit", // not going to show up
      stdin: "piped", // not going to show up
      stdout: "null", // not going to show up
      tsconfig: "tsconfig.json",
      unstable: true,
    };

    const f = buildFlags(options);
    let len = f.length;

    const noExist = (identifier: string) => {
      assert(
        f.indexOf(identifier) === -1,
        `\`${identifier}\` was found in flags, but was not expected.`,
      );
    };

    const exist = (identifier: string, value?: string) => {
      const i = f.indexOf(identifier);
      assert(i > -1, `\`${identifier}\` not found in flags`);
      if (value) {
        assertEquals(
          f[i + 1],
          value,
          `\`${identifier}\` flat value: (expecting: \`${value}\`, got \`${
            f[i + 1]
          }\`)`,
        );
        len--;
      }
      len--;
    };

    ["--watch", "--env", "--stderr", "--stdin", "--stdout"].forEach((_) =>
      noExist(_)
    );

    [
      "--allow-net",
      "--allow-env",
      "--allow-write",
      "--unstable",
      "--inspect=127.0.0.1:4321",
      "--inspect-brk=127.0.0.1:1234",
    ].forEach((_) => exist(_));

    const values = {
      "--cert": "secure.pem",
      "--import-map": "cool.code.json",
      "--lock": "lock.json",
      "--log-level": "info",
      "--config": "tsconfig.json",
    };

    Object.entries(values).forEach(([i, v]) => exist(i, v));

    assert(len === 0, "All flags should be tested");
  },
});
