---
title: Introduction
---

[![stars](https://img.shields.io/github/stars/denosaurs/denon?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAEFCu8CAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABHddaYAAABxElEQVRIDe2Wv04CQRDGAQuoTKQ2ITyADZWVJZWV+gJYWBNqKh/C16CRBlprWxsTE2NJfABNOH9z7Gzm2Nv7A8TCOMnHzs1838ze3e4ejUbMkiRZS64lP1x8MjTFr2DQE6Gl2nI+7POARXAmdbas44ku8eLGhU9UckRliX6qxM9sQvz0vrcVaaKJKdsSNO7LOtK1kvcbaXVRu4LMz9kgKoYwBq/KLBi/yC2DQgSnBaLMQ88Tx7Q3AVkDKHpgBdoak5HrCSjuaAW/6zOz+u/Q3ZfcVrhliuaPYCAqsSJekIO/TlWbn2BveAH5JZBVUWayusZW2ClTuPzMi6xTIp5abuBHxHLcZSyzkxHF1uNJRrV9gXBhOl7h6wFW/FqcaGILEmsDWfg9G//3858Az0lWaHhm5dP3i9JoDtTm+1UrUdMl72OZv10itfx3zOYpLAv/FPQNLvFj35Bnco/gzeCD72H6b4JYaDTpgidwaJOa3bCji5BsgYcDdJUamSMi2lQTCEbgu0Zz4Y5UX3tE3K/RTKny3qNWdst3UWU8sYtmU40py2Go9o5zC460l/guJjm1leZrjaiH4B4cVxUK12mGVTV/j/cDqcFClUX01ZEAAAAASUVORK5CYII=)](https://github.com/denosaurs/denon/stargazers)
[![workflow](https://img.shields.io/github/workflow/status/denosaurs/denon/CI%20check?logo=github)](https://github.com/denosaurs/denon/actions)
[![releases](https://img.shields.io/github/v/release/denosaurs/denon?logo=github)](https://github.com/denosaurs/denon/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-^1.2.0-informational?logo=deno)](https://github.com/denoland/deno)
[![deno doc](https://img.shields.io/badge/deno-doc-informational?logo=deno)](https://doc.deno.land/https/deno.land/x/denon/mod.ts)
[![discord](https://img.shields.io/discord/713043818806509608?logo=discord&logoColor=white)](https://discord.gg/shHG8vg)
[![license](https://img.shields.io/github/license/denosaurs/denon?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAEFCu8CAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABHddaYAAAC5UlEQVRIDd2WPWtVQRCGby5pVASLiGghQSxyG8Ui2KWwCfkH9olY2JneQkiR0oCIxH/gB+qVFDYBIWBAbAIRSbCRpLXwIxLiPT7vnNm9e87ZxJtUwYH3zO47Mzv7Mbv3tlo5KYriGtgAJ81OY1ENdG/YI4boFEOI911BXgY/pdtwGuAtXpvmB1tAXHDnUolE5urkPOQo6MqA3pXWmJJL4Bb4rQ7yEYfxsjnIF29NJIoNC6e5fxOL/qN+9KCz7AaLpN8zI415N2i2EptpGrkRIjGeAuvR6IY1hSFLFUOug9Ms2M7ZxIUNytm1mnME186sdI2BOCwAyQMg54ugzSmKmwbPwSbolKH+hbAtQdsOoF+BsF3anUVwBdiOWRidFZDKTTrKEAJTm3GVrGkHzw/uPZbyx7DNNLfB7KGmRsCcr+/gjaiPSpAOTyX9qG4L/XBDdWXDDf1M+wtQ5fwCOtcb4Dto6VpLmzByB6gqdHbTItGSJdAGqibJQhmRfCF7IN4beSF2G9CqnGXQrxofXU+EykllNeoczRgYytDKMubDIRK0g5MF8rE69cGu0u9nlUcqaUZ41W0qK2nGcSzr4D2wV9U9wxp1rnpxn8agXAOHMQ9cy9kbHM7ngY4gFb03TxrO/yfBUifTtXt78jCrjY/jgEFnMn45LuNWUtknuu7NSm7D3QEn3HbatV1Q2jvgIRf1sfODKQaeymxZoMLlTqsq1LF+HvaTqQOzEzUCfni0/eNIA+DfuE3KEtbsegckGmMktTXacnBHPVe687ugkpT+axCkkhBSyRSjWI2xf1KMMVmYiQdWksK9BEFiQoiYLIlvJA3/zeTzCejP0RbB6YPbhZuB+0pR3KcdX0LaJtju0ZgBL8Bd+sbz2QIaU2OfBX3BaQLsgZysQtrk0M8Sh1A0w3DyyYnGnAiZ4gqZ/TvI2A8OGd1YIbF7+F3P+B6dYpYdsJNZgrjO0UdOIhmom0nwL0pnfnzkL1803jAoKhvyAAAAAElFTkSuQmCC)](https://github.com/denosaurs/denon/blob/master/LICENSE)

denon is the [deno](https://deno.land/) replacement for [nodemon](https://nodemon.io/)
providing a feature packed, highly configurable and easy to use experience.

denon does **not** require _any_ additional changes to your code or method of development. `denon` is a replacement wrapper for `deno`. To use `denon`,replace the word `deno` on the command line when executing your script.

## Features

Denon provides most of the features you would expect of a file watcher and more.

- Automatically restart your deno projects
- Drop-in replacement for `deno` executable
- Extensive configuration options with script support
- Configurable file watcher with support for filesystem events and directory walking
- Ignoring specific files or directories with [glob](<https://en.wikipedia.org/wiki/Glob_(programming)>) patterns
- Not limited to deno projects with a powerful script configuration
