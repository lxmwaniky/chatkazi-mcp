# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-06-03

### Added
- Relevant package search keywords in `package.json` to improve discoverability on npm registry.
- Node.js version engines and package manager prerequisites details in `README.md` under local development.
- Build/compilation process details in `README.md`.
- Automated CI/CD pipelines including PR validation and semantic releasing workflows (`validate.yml` and `release.yml`).
- Semantic Release configuration (`.releaserc.json`) to automate npm publishing and changelog creation on main branch merges.
- `"typecheck": "tsc --noEmit"` script in `package.json` to support CI validation.

### Changed
- Incremented version from `1.0.0` to `1.0.1` for patch improvements.
