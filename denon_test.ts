import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { parseArgs } from "./denon.ts";

Deno.test(function parseArgsEmpty() {
    assertEquals(parseArgs([]), {
        config: undefined,
        debug: false,
        extensions: undefined,
        files: [],
        fullscreen: false,
        help: false,
        interval: undefined,
        match: undefined,
        permissions: [],
        quiet: false,
        runnerFlags: [],
        skip: undefined,
        watch: undefined
    });
});

Deno.test(function parseArgsAll() {
    assertEquals(
        parseArgs([
            ..."--config denon.json -dfqhe js,ts -i 500 -m foo/** -s bar/**".split(
                " "
            ),
            ..."-w lib/** --allow-run mod.ts -- --allow-net --port 500".split(
                " "
            )
        ]),
        {
            config: "denon.json",
            debug: true,
            extensions: "js,ts",
            files: ["mod.ts"],
            fullscreen: true,
            help: true,
            interval: "500",
            match: "foo/**",
            permissions: ["--allow-run"],
            quiet: true,
            runnerFlags: ["--allow-net", "--port", "500"],
            skip: "bar/**",
            watch: "lib/**"
        }
    );
});
