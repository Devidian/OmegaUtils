## [Unreleased]

## [0.5.0] - 2021-07-26
### Changed
- [breaking] now using native typescript from mongodb driver `4.x`

## [0.4.1] - 2021-05-11
### Fixed
- some bugs and deprecations

## [0.4.0] - 2021-05-10
### Changed
- complete refactoring with new stuff

## [0.3.1] - 2020-05-18
### Removed
- 'reconnect' event Listener for mongo connection (is deprecated)

## [0.3.0] - 2019-12-20
### Added
- new enum `Loglevel` for default log-levels
### Changed
- enum `LOGTAG` seperated into new file (may break code!)

## [0.2.4] - 2019-09-16
### Added
- new class `AppInfo` with static method to fetch app-version from `package.json` (more methods may follow)

## [0.2.3] - 2019-09-11
### Fixed
- bugs in `MongoApp` and `MongoCollection`

## [0.2.2] - 2019-09-03
### Changed
- Logger now looks up config on execution

## [0.2.1] - 2019-08-28
### Added
- Config interface has now `app.system` property

## [0.2.0] - 2019-08-05
### Fixed
- cfg property of MongoApp was not correct
### Changed
- Config.master renamed to app
- `ConfigLoader` now supports loading different configs by process args
### Added
- Config.log.devel
- `Logger` class
- `RandomTable` class
### Removed
- Config.worker

## [0.1.0] - 2019-02-22
### Initial commit
