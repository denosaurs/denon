---
title: Watcher Options
---

File watcher options:

```json
{
  "scripts": {
    /* */
  },

  "watcher": {
    // The number of milliseconds after the last change.
    "interval": 350,
    // The file extensions that it will scan for.
    "exts": ["js", "jsx", "ts", "tsx", "json"],
    // The globs that it will scan for.
    "match": ["*.*"],
    // The globs that it will not scan for.
    "skip": ["*/.git/*"],
    // Use the legacy file monitoring algorithm. (walking)
    "legacy": false
  }
}
```
