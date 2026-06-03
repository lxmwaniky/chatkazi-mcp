## [1.0.2](https://github.com/lxmwaniky/chatkazi-mcp/compare/v1.0.1...v1.0.2) (2026-06-03)


### Bug Fixes

* resolve scoped publish permission and clean oidc configuration ([02e77c2](https://github.com/lxmwaniky/chatkazi-mcp/commit/02e77c2869da6b48273a9d90325d7d24c7250acc))

## [1.0.1](https://github.com/lxmwaniky/chatkazi-mcp/compare/v1.0.0...v1.0.1) (2026-06-03)


### Bug Fixes

* sanitize recipient phone numbers locally before sending ([40f3629](https://github.com/lxmwaniky/chatkazi-mcp/commit/40f3629928a1eda6a91bf41c3ebd96d4233cd947))

# 1.0.0 (2026-06-03)


### Features

* add ChatKazi client and server integration ([1a89f38](https://github.com/lxmwaniky/chatkazi-mcp/commit/1a89f38d23441a79c7e590565f324a60d24a067b))
* add initial README.md with project overview and configuration details ([57889cb](https://github.com/lxmwaniky/chatkazi-mcp/commit/57889cb9095159515bf32077cfcfaf4a480484c6))
* **ci:** configure oidc permissions and [secure] publishing in release workflow for secure release ([8760ac7](https://github.com/lxmwaniky/chatkazi-mcp/commit/8760ac71131a60dadefff54dc126ab75a763a33a))
* setup semantic release CI/CD workflows and add package typechecking script ([9529aba](https://github.com/lxmwaniky/chatkazi-mcp/commit/9529abae27b1f2b1d6c54ae0062a2fee665513c5))

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
- Secure OIDC/Provenance publishing on npm within `release.yml` using `id-token` write permissions and `'provenance'` publishing configurations.

### Changed
- Incremented version from `1.0.0` to `1.0.1` for patch improvements.

### Fixed
- Added client-side phone number sanitization to `src/client.ts` (`sanitizePhone`), stripping spaces, hyphens, and leading `+` characters before hitting the ChatKazi API endpoints.
