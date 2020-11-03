---
title: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To install denon simply enter the following into a terminal:

<Tabs
groupId="registry"
defaultValue="official"
values={[
{label: 'deno.land', value: 'official'},
{label: 'nest.land', value: 'nest'},
]}>
<TabItem value="official">

```bash
deno install -qA -f --unstable https://deno.land/x/denon@2.3.2/denon.ts
```

</TabItem>
<TabItem value="nest">

```bash
deno install -qA -f --unstable https://x.nest.land/denon@2.3.2/denon.ts
```

</TabItem>
</Tabs>

## Autocompletion

In **zsh**, you can install autocompletion with:

```bash
echo '. <(denon --completion)' >> ~/.zshrc
```

In **bash**:

```bash
denon --completion >> ~/.config/denon.completion.sh
echo 'source ~/.config/denon.completion.sh' >> ~/.bash_profile
```

In **fish**:

```bash
echo 'denon --completion-fish | source' >> ~/.config/fish/config.fish
```
