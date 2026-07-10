# Progress

## Current status

- Completed the core engine slices through minimal save/load, a second system type (decay), and the Formula/Value math primitives with number/BigNumber ergonomics.
- Verified deterministic simulation behavior, offline advancement, full save/load round-tripping, multi-system interaction, and Value/Formula resolution end to end.

## Recently completed

- Implemented the engine foundation: GameState, Entity, ProductionComponent, EntityAPI, ComponentAPI, ResourceAPI, and ProductionSystem.
- Added a pluggable TimeSource abstraction and LocalTimeSource.
- Added offline progression support through Clock.advanceOffline() and Engine.loadOffline().
- Established a folder convention where interfaces live under their own interfaces/ subdirectory.
- BigNumber integration is complete: GameState.resources, ProductionComponent.rate, ResourceAPI, and ProductionSystem all operate on BigNumber.
- Minimal save/load is complete: SaveData (versioned GameState wrapper), Serializer (GameState/SaveData <-> JSON, with generic BigNumber tagging via a replacer/reviver so it works anywhere in the state tree, not just resources), SaveEncoder (JSON <-> checksummed blob, base64 + djb2 checksum, throws on corruption/tamper detection), StorageAdapter interface + LocalStorageAdapter (pluggable persistence, same pattern as TimeSource), and SaveManager (orchestrates the pipeline, with saveKey/saveVersion passed in by the game rather than hardcoded by the engine). Engine now owns a SaveManager and exposes save()/load() facade methods.
- Verified end to end in main.ts: ticking a game, saving it, loading into a separate fresh instance, and confirming BigNumber values survive the round trip intact.
- Slice 7: added DecaySystem as a second system type, to stress-test multi-system architecture before moving into the bigger Formula/Value/Definitions design work. DecayComponent (resource, rate, optional clampAtZero defaulting to true) mirrors ProductionComponent's shape. DecaySystem subtracts rate * deltaTime from a resource each tick, clamping the actual subtraction to never exceed the current resource amount when clampAtZero is true (via new BigNumber.min()/max() helpers), using ResourceAPI.add() with a negated amount rather than adding a new subtract method to ResourceAPI. Registered alongside ProductionSystem in GameSetup.ts's Simulation, with a new decay-only goldVault entity added to isolate decay behavior from production. Verified end to end in main.ts: production (25/sec) and decay (5/sec) both acting on the same gold resource in one tick produced the correct net result (200 gold after 10s), confirming systems run in registration order and interact correctly on shared state.
- Slice 8: added Formula (type alias, `(level: number) => number | BigNumber`) and Value (class wrapping a discriminated union `ValueSource` of `{kind: "constant", value: BigNumber}` or `{kind: "formula", formula: Formula}`, with private constructor, static factories `Value.constant()`/`Value.fromFormula()`, and a single `resolve(level = 0): BigNumber` method). Chose function-based Formulas over data-driven ones: Formulas only ever live on Definitions (static content, never part of GameState, never touched by Serializer), so the serializability argument for a data-driven interpreter didn't apply, and predicting every formula shape up front isn't feasible. Verified in main.ts: a constant Value resolving identically regardless of level argument, and a formula-backed Value (`10 * 1.15^level`, an upgrade-cost-style curve) resolving correctly at levels 0/5/10.
- Slice 8 follow-up: closed the deferred BigNumber ergonomics item. Added `BigNumber.from(value: number | BigNumber): BigNumber`, a static normalization helper (passes through an existing BigNumber, otherwise delegates to `fromNumber`). Relaxed `Formula`'s return type and `Value.constant()`'s parameter type to `number | BigNumber`, normalizing via `BigNumber.from()` at those two boundary points only. `ValueSource` and `Value.resolve()` remain strictly `BigNumber` internally, so the ergonomics only loosen at the exact points a game dev supplies a number — everything downstream (systems, APIs, BigNumber arithmetic) stays untouched and fully strict. Re-verified in main.ts with the same test cases rewritten using plain numbers only (no explicit BigNumber construction), confirming identical resolved output to the original explicit version.

## Deferred / follow-up

- System clock resilience is partially handled with negative-time clamping and max elapsed caps.
- External or server-based time sources remain deferred until networking and save infrastructure are in place.
- Save migrations (Migration.ts) are deferred; SaveData.version exists and is stamped on every save, giving future migration logic something to key off, but no migration logic has been written yet.
- SaveEncoder's checksum is a non-cryptographic djb2 hash for corruption/tamper *detection* only, not prevention (a determined player can still recompute a valid checksum for edited data, since there's no secret key). True cryptographic hashing (e.g. Web Crypto SHA-256) was considered but deferred, since it would require making the save pipeline asynchronous and wouldn't add tamper-prevention anyway without server-side verification.
- Isolated runtime testing of DecaySystem's clamp-at-zero behavior was deferred, since createGame() doesn't currently support custom starting state/entities for testing. The clamp logic was verified by code review and by the production+decay net-rate test. A proper test suite (with the ability to construct custom test states) is planned as a future slice.
- number | BigNumber ergonomics currently only apply to Value/Formula (the two points a game dev supplies a number today). Component fields like ProductionComponent.rate and DecayComponent.rate are not yet Value-backed and still require explicit BigNumber construction in game definitions (e.g. buildings.ts) — deferred until Slice 9 introduces Definitions/Upgrades and those fields have a reason to become Value-typed.

## Open items

- Migration
- EventSystem, FormulaSystem, ModifierSystem
- QueryAPI, GameAPI
- Definitions, Upgrades
- Test suite (including support for constructing custom test states)

## Next focus

- Slice 9: Definitions, Upgrades, and ModifierSystem, built on top of the Formula/Value foundation from Slice 8. Modifiers are planned to be live-resolved each tick (recomputing effective values from registered modifiers) rather than mutating components at purchase time, keeping state clean and modifiers reversible.