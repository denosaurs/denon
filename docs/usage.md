---
title: Usage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Denon** is designed to work as a **drop-in replacement** for the deno cli. It also supports configuration files if you want to create shorcuts for your most used commands or you want to fine tune the file watcher.

## Working with the CLI

Every command that you usually run with the deno cli works with denon out of the box:

```bash
denon run app.ts
```

```bash
denon run --allow-net app.ts
```

```bash
denon run --allow-net app.ts --port=3000
```

## Working with configuration files

**Denon** also supports scripts inside configurations in your local directory, allowing you to declare script once and then run them just by calling their name.

You can create a configuration as a JSON, YAML, or Typescript file:

<Tabs
groupId="configuration-format"
defaultValue="json"
values={[
{label: 'JSON', value: 'json'},
{label: 'YML', value: 'yaml'},
{label: 'Typescript', value: 'typescript'},
]}>
<TabItem value="json">

```json title="denon.json"
{
  "scripts": {
    "start": "deno run app.ts",
    "test": "deno test --allow-read"
  }
}
```

</TabItem>
<TabItem value="yaml">

```yml title="denon.yml"
scripts:
  start: "deno run app.ts"
  test: "deno test --allow-read"
```

</TabItem>
<TabItem value="typescript">

```typescript title="denon.config.ts"
import { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: "deno run app.ts",
    test: "deno test --allow-read",
  },
};

export default config;
```

</TabItem>
</Tabs>

In the same directory as the configuration you can then run your application by simply typing:

```
denon start
```

```
denon test
```

**Denon** configuration is very powerful, you can learn how to tweak script options and file watcher parameters in the Advanced configuration
