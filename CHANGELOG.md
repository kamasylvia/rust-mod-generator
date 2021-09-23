# Change Log

All notable changes to the "rust-mod-generator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [1.0.6] - 2021-09-23

### Changed

- The extension is enabled if and only if a Cargo.toml file was found under the workspace.

## [1.0.5] - 2021-09-22

### Changed

- Fix sometimes created an empty directory when we expected to new a mod directory.

## [1.0.4] - 2021-09-22

### Added

- Only allow to create a mod from a folder/directory
  which contains either a "mod.rs" or a "lib.rs".

## [1.0.2] - 2020-06-22

### Changed

- Error window.

## [1.0.1] - 2020-06-22

### Changed

- The placeholder of the access modifier selection list.

## [1.0.0] - 2020-06-22

### Added

- This changelog.
- Allow to select a access modifier.
- Auto declare the new created module in a resource file, usually `./mod.rs`.
- An extension setting `rust-mod-generator.addModDeclaration`.
- An extension setting `rust-mod-generator.selectAccessModifier`.

## [0.0.3] - 2020-06-21

### Added

- An extension setting `rust-mod-generator.autoFocus`.

## [0.0.2] - 2020-06-21

### Added

- A logo of this extension.

## [0.0.1] - 2020-06-21

### Added

- Initial release.
