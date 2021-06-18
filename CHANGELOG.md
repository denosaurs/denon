# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to
[Semantic Versioning].

## [2.4.8] - 2021-06-18

## [2.4.7] - 2021-02-03

### Bug Fixes

- permission error on latest deno ([`0776e6c`])

## [2.4.6] - 2021-01-06

### Bug Fixes

- remove unused , update ([`39ba36c`])
- add version for schema in `script.json` ([`c3b3d46`])

## [2.4.5] - 2020-11-21

### Features

- add sidebar.json to docs ([`6f45cb3`])
- add -r flag to upgrade command ([`0cceaaa`])
- issue 49 example ([`f6fb3da`])

### Bug Fixes

- change *.* to **/*.* ([`201d7bc`])

## [2.4.4] - 2020-10-10

### Bug Fixes

- branch detection ([`c78788f`])

## [2.4.3] - 2020-10-10

## [2.4.2] - 2020-10-10

### Features

- re-add quiet config option ([`10b5669`])
- issue_91 example ([`9e81f99`])
- re-add logger config ([`17e609d`])
- new example for testing with issue #101 ([`5ceb849`])

### Bug Fixes

- merge pr #106 ([`c1f2b85`])
- solve lint issues ([`5afb34d`])
- correctly clean watcher config ([`475ddf6`])
- patch #102 ([`9f1bf13`])

## [2.4.1] - 2020-10-02

### Bug Fixes

- typescript export notation for DenonConfig ([`7858474`])

## [2.4.0] - 2020-09-14

### Features

- change default file name to scripts ([`6146dec`])

### Bug Fixes

- deno 1.4.0 compatibility ([`7c1e3e4`])
- force quit when `watch` is false ([`68c1d83`])
- add latest version check ([`74caccf`])

## [2.3.3] - 2020-08-29

### Features

- deno 1.3.2 support ([`68c38ad`])

### Bug Fixes

- improve clarity of "starting" logs ([`1066934`])

## [2.3.2] - 2020-08-06

## [2.3.1] - 2020-08-04

### Features

- :grey_question: added did you mean error ([`fbd88b9`])
- Add --quiet to prettify denon output ([`e99be5a`])
- :vertical_traffic_light: Deno version compat checking ([`958e2a1`])
- :watch: Only log watch config when watching ([`c6c30fd`])

### Bug Fixes

- deno registry bugs (#84) ([`e2362cc`])

## [2.3.0] - 2020-07-27

### Features

- add custom logger ([`c3d22cc`])
- add sequential scripts related to #50 ([`a5f573f`])

### Bug Fixes

- requested changes ([`957a9df`])
- legacy watcher related to #73 ([`e4ac148`])

## [2.2.1] - 2020-07-14

### Bug Fixes

- temp fix for outdated dependencies in omelette (#74) ([`99d586d`])
- :arrow_up: Updated std dependencies to 0.61.0 ([`60250e3`])
- export to import ([`d1c79cf`])
- wrong version in configuration ([`391acc4`])
- allow bolean as permissions ([`185f20d`])

## [2.2.0] - 2020-06-16

### Features

- add nest.land support ([`e809571`])

### Bug Fixes

- bump deno stdlib ([`7096f33`])
- denon.config.ts file:// is now correctly resolved ([`e29d18e`])
- add file:// resolve ([`bf64a29`])
- config.ts import resolve ([`63318dd`])
- update permissions ([`63735c2`])
- remove net permission ([`4ac58ad`])
- add log for config reader failiure ([`4b4df06`])
- permission and template fetching issue ([`66dc595`])

## [2.1.0] - 2020-06-05

### Features

- add config template support ([`afbc934`])
- configuration reloading and opt-out watch ([`6ad9066`])
- add .ts config file option ([`be1456e`])

### Bug Fixes

- fix code_of_conduct ([`949e4bd`])

## [2.0.2] - 2020-05-25

### Features

- v2.0.2 ([`96b45d8`])
- upgrade to specific version ([`1bd2929`])

## [2.0.1] - 2020-05-25

### Features

- 2.0.1 ([`c6f9772`])
- updated logger ([`7712065`])
- autocompletion with omelette ([`9ab4fb4`])
- add descriptions for JSON schema ([`111db54`])
- add JSON schema ([`dba6782`])

### Bug Fixes

- remove error log ([`2143585`])
- change runner behaviour ([`af9c048`])
- add config isFile check ([`735951e`])
- arg detection ([`eb033b7`])
- code format ([`4402896`])
- rework fsevent gathering to better support linux ([`003058d`])
- upgrade errors ([`5e44ffa`])
- add access to reload events to support vscode on linux ([`a3a0a3c`])
- log option are now configured correctly ([`3dcdc9a`])
- make failing status more forgiving ([`0e900ad`])
- --inspect-brk flag typo ([`939e904`])
- spell check ([`f4b5e40`])
- export only the needed objects from config.ts ([`a8fd211`])
- help message ([`b32b037`])

## [2.0.0] - 2020-05-22

### Features

- add helpful message when scripts are not found ([`fe287d8`])
- denon --upgrade (#26, #43) ([`d1c3568`])

### Bug Fixes

- upgrade holds ([`41f46bd`])
- typo ([`15599ca`])
- change version number ([`20ca84d`])

## [1.9.2] - 2020-05-14

## [1.9.1] - 2020-05-09

## [1.9.0] - 2020-05-07

## [1.8.0] - 2020-04-30

## [1.7.0] - 2020-04-23

### Features

- Added fmt and test flags (#27) ([`c5d19c3`])

## [1.6.0] - 2020-04-18

### Features

- check for executable config and directory ([`0005bc0`])

### Bug Fixes

- support using arg multiple times ([`2f79aae`])
- fix formating, add ci fmt check ([`60c040b`])

## [1.5.0] - 2020-04-11

## [1.4.0] - 2020-04-03

### Features

- add deno permission args ([`5c80877`])

### Bug Fixes

- updated some types for deno 0.38.0 ([`db6e602`])

## [1.3.0] - 2020-02-07

## [1.2.1] - 2020-01-21

## [1.2.0] - 2020-01-20

## [1.1.0] - 2020-01-17

## [1.0.0] - 2020-01-17

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
[2.4.8]: https://github.com/denosaurs/denon/compare/2.4.7...2.4.8
[2.4.7]: https://github.com/denosaurs/denon/compare/2.4.6...2.4.7
[`0776e6c`]: https://github.com/denosaurs/denon/commit/0776e6c58a2322c14b6e145b8d0f918fdd97c80e
[2.4.6]: https://github.com/denosaurs/denon/compare/2.4.5...2.4.6
[`39ba36c`]: https://github.com/denosaurs/denon/commit/39ba36c32937a55a3bdce32f06a079b9a41c6e46
[`c3b3d46`]: https://github.com/denosaurs/denon/commit/c3b3d46d9d95a1368d98540fd0b7184f1745f2f4
[2.4.5]: https://github.com/denosaurs/denon/compare/2.4.4...2.4.5
[`6f45cb3`]: https://github.com/denosaurs/denon/commit/6f45cb3fb63f3e661a55bcaccfd75b5a6e37bd24
[`0cceaaa`]: https://github.com/denosaurs/denon/commit/0cceaaa8238733aad5346ab9d372d8ce96d78cd7
[`f6fb3da`]: https://github.com/denosaurs/denon/commit/f6fb3dab25f1f0ef30a92d7f38f34af159dee767
[`201d7bc`]: https://github.com/denosaurs/denon/commit/201d7bc0161a66b07b675f8f094819f580ef2018
[2.4.4]: https://github.com/denosaurs/denon/compare/2.4.3...2.4.4
[`c78788f`]: https://github.com/denosaurs/denon/commit/c78788f2611bbfd2e31b2d6b2417d14c34d435d3
[2.4.3]: https://github.com/denosaurs/denon/compare/2.4.2...2.4.3
[2.4.2]: https://github.com/denosaurs/denon/compare/2.4.1...2.4.2
[`10b5669`]: https://github.com/denosaurs/denon/commit/10b566920d760f30e852916c0465ea05003f3102
[`9e81f99`]: https://github.com/denosaurs/denon/commit/9e81f99d6318e8ce38673583d49a50a9c6dbb3d2
[`17e609d`]: https://github.com/denosaurs/denon/commit/17e609dbc4d8696e7e3c26275bf860072914d9a1
[`5ceb849`]: https://github.com/denosaurs/denon/commit/5ceb8490c7a0f9787abf9c32c22fc9bd77e557e5
[`c1f2b85`]: https://github.com/denosaurs/denon/commit/c1f2b857f358de9fab55e21e8837761fd52f3d4c
[`5afb34d`]: https://github.com/denosaurs/denon/commit/5afb34dc9af4def36ed1c4642a59fa4dd4fa6991
[`475ddf6`]: https://github.com/denosaurs/denon/commit/475ddf6ea75e2aec0ed77fb72485724eac12de98
[`9f1bf13`]: https://github.com/denosaurs/denon/commit/9f1bf13d16ba94050ec4cd7e158a4576e1a48966
[2.4.1]: https://github.com/denosaurs/denon/compare/2.4.0...2.4.1
[`7858474`]: https://github.com/denosaurs/denon/commit/7858474659aaf09dda0b86e21895b2ea80cc7c63
[2.4.0]: https://github.com/denosaurs/denon/compare/2.3.3...2.4.0
[`6146dec`]: https://github.com/denosaurs/denon/commit/6146dec3adf701dde3e6479ce5d808f3aff53c77
[`7c1e3e4`]: https://github.com/denosaurs/denon/commit/7c1e3e48c4bff1beaf965dd8dc61f29383b2414d
[`68c1d83`]: https://github.com/denosaurs/denon/commit/68c1d8384a4888d8c8fb2ab3d71ecf719828cf7b
[`74caccf`]: https://github.com/denosaurs/denon/commit/74caccf117611d97e6c0ffb022a773811b5a5dd5
[2.3.3]: https://github.com/denosaurs/denon/compare/2.3.2...2.3.3
[`68c38ad`]: https://github.com/denosaurs/denon/commit/68c38ad0743701811452d02fd3f2a2623a468fe8
[`1066934`]: https://github.com/denosaurs/denon/commit/106693419303395cfc4037ddfbb5d74bd75def73
[2.3.2]: https://github.com/denosaurs/denon/compare/2.3.1...2.3.2
[2.3.1]: https://github.com/denosaurs/denon/compare/2.3.0...2.3.1
[`fbd88b9`]: https://github.com/denosaurs/denon/commit/fbd88b99f16a42df00217f7a4e8e54a4a45f3a9d
[`e99be5a`]: https://github.com/denosaurs/denon/commit/e99be5a24170ee594c0c400bab2d67ac8d546014
[`958e2a1`]: https://github.com/denosaurs/denon/commit/958e2a1107296edc6abf9271116ab7fe0b2fef45
[`c6c30fd`]: https://github.com/denosaurs/denon/commit/c6c30fdaecc2f1fbe897b9f8c86ce34194b8a357
[`e2362cc`]: https://github.com/denosaurs/denon/commit/e2362cc5648a7000f47f84b6df17d75a9bc808fd
[2.3.0]: https://github.com/denosaurs/denon/compare/2.2.1...2.3.0
[`c3d22cc`]: https://github.com/denosaurs/denon/commit/c3d22ccb1898bd396f04444a4584e848845f541b
[`a5f573f`]: https://github.com/denosaurs/denon/commit/a5f573fbc328ff5aec536e4b9fd46e749c5e24ef
[`957a9df`]: https://github.com/denosaurs/denon/commit/957a9dfaf70b6bc85bc54c0fef1653dae258f2b6
[`e4ac148`]: https://github.com/denosaurs/denon/commit/e4ac14883aeb0059ef98830eb4f94f9eda5fc5d1
[2.2.1]: https://github.com/denosaurs/denon/compare/2.2.0...2.2.1
[`99d586d`]: https://github.com/denosaurs/denon/commit/99d586dd608dc091297ff04646887dfc7439a56e
[`60250e3`]: https://github.com/denosaurs/denon/commit/60250e3ea8058e20afabffd9c1e4f915eec8463f
[`d1c79cf`]: https://github.com/denosaurs/denon/commit/d1c79cff38bb6b35b909c0f56c7378ae1922aa86
[`391acc4`]: https://github.com/denosaurs/denon/commit/391acc4f4326ef0c98d2684c87e1073189fffa4b
[`185f20d`]: https://github.com/denosaurs/denon/commit/185f20d62ca336ddba04cc8cfc50a4f0c9d75e49
[2.2.0]: https://github.com/denosaurs/denon/compare/2.1.0...2.2.0
[`e809571`]: https://github.com/denosaurs/denon/commit/e8095718f4ee8e99723be852434e0bc63bb68f70
[`7096f33`]: https://github.com/denosaurs/denon/commit/7096f33c12d3a45be9547d6b35eab0aba723b3e7
[`e29d18e`]: https://github.com/denosaurs/denon/commit/e29d18e9999b0a59066c979fd57e50e9964f52fe
[`bf64a29`]: https://github.com/denosaurs/denon/commit/bf64a2925bd701eb7f56d8377984e3b849c75146
[`63318dd`]: https://github.com/denosaurs/denon/commit/63318ddc567c0b469b234fe96a3c2c05e2511f21
[`63735c2`]: https://github.com/denosaurs/denon/commit/63735c2bd1e7be9b092d80def17c1b6d16108db5
[`4ac58ad`]: https://github.com/denosaurs/denon/commit/4ac58ad687fb5b985e819c6d19679ed5f247eae3
[`4b4df06`]: https://github.com/denosaurs/denon/commit/4b4df06a42e1b9a229162eded488ff911552d4f8
[`66dc595`]: https://github.com/denosaurs/denon/commit/66dc595862175706d377abbc23ed1bf466815770
[2.1.0]: https://github.com/denosaurs/denon/compare/2.0.2...2.1.0
[`afbc934`]: https://github.com/denosaurs/denon/commit/afbc934d8326816766831cce5a11beaad9fa0afa
[`6ad9066`]: https://github.com/denosaurs/denon/commit/6ad9066755d6fd66f8d932cf3fca984551ab7b0e
[`be1456e`]: https://github.com/denosaurs/denon/commit/be1456e7633f71aca80f9a074ba8e17931562902
[`949e4bd`]: https://github.com/denosaurs/denon/commit/949e4bdf57f2c84ef109c17c7f5d74751e42dff5
[2.0.2]: https://github.com/denosaurs/denon/compare/2.0.1...2.0.2
[`96b45d8`]: https://github.com/denosaurs/denon/commit/96b45d8b236046a8b5e3602d003df0ea08e721e9
[`1bd2929`]: https://github.com/denosaurs/denon/commit/1bd29294bfc2c1b05f2615151b20fecbe9285979
[2.0.1]: https://github.com/denosaurs/denon/compare/2.0.0...2.0.1
[`c6f9772`]: https://github.com/denosaurs/denon/commit/c6f97726dc474c04a3fe2f71d034b22cee8c1234
[`7712065`]: https://github.com/denosaurs/denon/commit/77120658dc2d2e714f4c428eb7336f8676a4a8bf
[`9ab4fb4`]: https://github.com/denosaurs/denon/commit/9ab4fb40cf2eefe21138fb85c3faa3825785e564
[`111db54`]: https://github.com/denosaurs/denon/commit/111db54e0c93f7012cc15f63a9b00aa061c1020b
[`dba6782`]: https://github.com/denosaurs/denon/commit/dba6782ba2e616cf6d14e762e3629144e455e6ec
[`2143585`]: https://github.com/denosaurs/denon/commit/21435851bcdbd3aa14b6db533594c73fc4ebe573
[`af9c048`]: https://github.com/denosaurs/denon/commit/af9c048bd0abd920268dfb8ae42673fd2a649461
[`735951e`]: https://github.com/denosaurs/denon/commit/735951e0008bdcd5e40ccfb7381e7839b8eaf30c
[`eb033b7`]: https://github.com/denosaurs/denon/commit/eb033b74a741b200c8a935bea51f0ba5d7e5810a
[`4402896`]: https://github.com/denosaurs/denon/commit/440289666d145adb6b0093818669e409526c1c42
[`003058d`]: https://github.com/denosaurs/denon/commit/003058dd9558233f7fcac7dcd49a3e567a0928bb
[`5e44ffa`]: https://github.com/denosaurs/denon/commit/5e44ffa3b61384d35fe0f21f1e25dd04cc20992c
[`a3a0a3c`]: https://github.com/denosaurs/denon/commit/a3a0a3c0a3e24bf13e278b90a50447369692364f
[`3dcdc9a`]: https://github.com/denosaurs/denon/commit/3dcdc9a43717c49fe93ecf16f3d5975523e60476
[`0e900ad`]: https://github.com/denosaurs/denon/commit/0e900ad360c34383da7dbaace966d7c13b5e4129
[`939e904`]: https://github.com/denosaurs/denon/commit/939e904cf304acd2afef76355b3709acdb3a84a3
[`f4b5e40`]: https://github.com/denosaurs/denon/commit/f4b5e40896f10152fa27bf5f8ed86d8255ce56a5
[`a8fd211`]: https://github.com/denosaurs/denon/commit/a8fd2117611922fec0a7b4773f8023164ac6f1e8
[`b32b037`]: https://github.com/denosaurs/denon/commit/b32b03778016d77db545bd247cabbe5bc54a4394
[2.0.0]: https://github.com/denosaurs/denon/compare/1.9.2...2.0.0
[`fe287d8`]: https://github.com/denosaurs/denon/commit/fe287d82768d0ce231ec52e38c72eb1fd1169653
[`d1c3568`]: https://github.com/denosaurs/denon/commit/d1c35686ac0f70d359483a75a42eff1490110d9e
[`41f46bd`]: https://github.com/denosaurs/denon/commit/41f46bd097f3ed7891500d7c02faf8057d1a203b
[`15599ca`]: https://github.com/denosaurs/denon/commit/15599cab1587fe44a373fc4778299d4d67fa9db9
[`20ca84d`]: https://github.com/denosaurs/denon/commit/20ca84df67fcd32f5ae678f1d43333237fb0dca5
[1.9.2]: https://github.com/denosaurs/denon/compare/1.9.1...1.9.2
[1.9.1]: https://github.com/denosaurs/denon/compare/1.9.0...1.9.1
[1.9.0]: https://github.com/denosaurs/denon/compare/1.8.0...1.9.0
[1.8.0]: https://github.com/denosaurs/denon/compare/1.7.0...1.8.0
[1.7.0]: https://github.com/denosaurs/denon/compare/1.6.0...1.7.0
[`c5d19c3`]: https://github.com/denosaurs/denon/commit/c5d19c3653b2e0d13a053839bccaf739d9ca06f5
[1.6.0]: https://github.com/denosaurs/denon/compare/1.5.0...1.6.0
[`0005bc0`]: https://github.com/denosaurs/denon/commit/0005bc0439d09a61adf40dc63aac9bd33054c056
[`2f79aae`]: https://github.com/denosaurs/denon/commit/2f79aaec8ec44f62ee8ccd6e46fcce4fea6329a7
[`60c040b`]: https://github.com/denosaurs/denon/commit/60c040b8e0d46f4facbe87d1c9461947c8bc49ee
[1.5.0]: https://github.com/denosaurs/denon/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/denosaurs/denon/compare/1.3.0...1.4.0
[`5c80877`]: https://github.com/denosaurs/denon/commit/5c8087700abdb9b7231d199f602c4ee862c0c27f
[`db6e602`]: https://github.com/denosaurs/denon/commit/db6e6029faad7bedeaf1e3f8dd4d67cc6e6b9e74
[1.3.0]: https://github.com/denosaurs/denon/compare/1.2.1...1.3.0
[1.2.1]: https://github.com/denosaurs/denon/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/denosaurs/denon/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/denosaurs/denon/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/denosaurs/denon/compare/1.0.0
