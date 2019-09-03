## [Unreleased]

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