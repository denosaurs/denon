---
title: Templates
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**Denon** is designed to be simple but also extremely configurable to fit your project needs. It supports `JSON`, `YAML`, and `Typescript` configuration file. Example in this page are provided in all three formats.

to create a basic configuration in the root directory of your project you can run:

```
denon --init
```

this will create a basic `denon.json` file:

```json
{
  "scripts": {
    "start": "app.js"
  }
}
```

you can also initialize from a custom template
(see the [`templates`](https://github.com/denosaurs/denon/tree/master/templates) folder for all the available templates)

```
denon --init <template>
```

<Tabs
groupId="configuration-format"
defaultValue="json"
values={[
{label: 'JSON', value: 'json'},
{label: 'YML', value: 'yaml'},
{label: 'Typescript', value: 'typescript'},
]}>
<TabItem value="json">

```json title="template for denon.json"
{
  "$schema": "https://deno.land/x/denon/schema.json",
  "scripts": {
    "start": {
      "cmd": "deno run app.ts",
      "desc": "run my app.ts file"
    }
  }
}
```

</TabItem>
<TabItem value="yaml">

```yml title="template for denon.yml"
scripts:
  start:
    cmd: "deno run app.ts"
    desc: "run my app.ts file"
```

</TabItem>
<TabItem value="typescript">

```typescript title="template for denon.config.ts"
import { DenonConfig } from "https://deno.land/x/denon/mod.ts";
// ^ imports will be removed for semplicity in the next examples
export default <DenonConfig>{
  scripts: {
    start: {
      cmd: "deno run app.ts",
      desc: "run my app.ts file",
    },
  },
};
```

</TabItem>
</Tabs>
