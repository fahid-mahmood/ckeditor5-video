Changelog
=========

Changes for the past releases below.

## 43.3.0 (2025-08-23)
### Upgraded
* CKEditor 5 dependencies to 43.3.x (core, engine, utils, widget, ui, etc.).
* Tooling packages updated to v43 where applicable (dev-utils, dev-translations).

### Migration
* Replaced deprecated deep imports with public API where available:
  - `@ckeditor/ckeditor5-clipboard/src` → `@ckeditor/ckeditor5-clipboard`.
  - `@ckeditor/ckeditor5-core/src/command` → `{ Command }` from `@ckeditor/ckeditor5-core`.
* Verified the sample build with Webpack 5. No runtime errors observed in build output.

### Notes
* Requires Node.js 18+ (tested with Node 20.18.x).
* Predefined builds (`@ckeditor/ckeditor5-build-*`) are deprecated upstream; this package continues to work with modular plugins.

## 29.1.0(2021-09-04)
### Upgraded
* CkEditor5 dependencies to v29.1.0

## 29.0.1(2021-09-04)
### Upgraded
* Bugfix for when inserting a video, the wrong file vs files options is being used

## 29.0.0(2021-08-22)
### Upgraded
* CkEditor5 dependencies to v29.0.0

## 28.0.0(2021-06-12)
### Upgraded
* CkEditor5 dependencies to v28.0.0

## 27.1.0(2021-06-01)
### Upgraded
* CkEditor5 dependencies to v27.1.0
* Adding VideoInsert to the lib

## 23.1.0(2020-11-19)
### Upgraded
* CkEditor5 dependencies to v23.1.0

## 23.0.1(2020-11-19)
### Added
* Chinese translations

## 23.0.0(2020-11-18)
### Added
* Style support [#1](https://github.com/Technologie-Visao/ckeditor5-video/issues/1) 
* Balloon toolbar support
* More documentation

### Fixed
* Jumping versions to follow the ck-editor5 dependencies
of this package. (23.0.x here)

## 0.0.2(2020-10-21)
### Added
* A bit of doc in the readme

### Fixed
* Uncommented UploadVideoCommand toolbar ui condition 


## 0.0.1(2020-10-20)
### Added
* Published package to npm
* Video plugin
* Video Upload Plugin
* Video Resize Plugin
