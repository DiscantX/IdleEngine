# Progress

## Current status

- Completed the core engine slices up through minimal save/load and a second system type (decay).
- Verified deterministic simulation behavior, offline advancement, full save/load round-tripping, and multi-system interaction end to end.

## Recently completed

- Implemented the engine foundation: GameState, Entity, ProductionComponent, EntityAPI, ComponentAPI, ResourceAPI, and ProductionSystem.
- Added a pluggable TimeSource abstraction and LocalTimeSource.
- Added offline progression support through Clock.advanceOffline() and Engine.loadOffline().
- Established a folder convention where interfaces live under their own interfaces/ subdirectory.
- BigNumber integration is complete: GameState.resources, ProductionComponent.rate, ResourceAPI, and ProductionSystem all operate on BigNumber.
- Minimal save/load is complete: SaveData (versioned GameState wrapper), Serializer (GameState/SaveData <-> JSON, with generic BigNumber tagging via a replacer/reviver so it works anywhere in the state tree, not just resources), SaveEncoder (JSON <-> checksummed blob, base64 + djb2 checksum, throws on corruption/tamper detection), StorageAdapter interface + LocalStorageAdapter (pluggable persistence, same pattern as TimeSource), and SaveManager (orchestrates the pipeline, with saveKey/saveVersion passed in by the game rather than hardcoded by the engine). Engine now owns a SaveManager and exposes save()/load() facade methods.
- Verified end to end in main.ts: ticking a game, saving it, loading into a separate fresh instance, and confirming BigNumber values survive the round trip intact.
- Slice 7: added DecaySystem as a second system type, to stress-test multi-system architecture before moving into the bigger Formula/Value/Definitions design work. DecayComponent (resource, rate, optional clampAtZero defaulting to true) mirrors ProductionComponent's shape. DecaySystem subtracts rate * deltaTime from a resource each tick, clamping the actual subtraction to never exceed the current resource amount when clampAtZero is true (via new BigNumber.min()/max() helpers), using ResourceAPI.add() with a negated amount rather than adding a new subtract method to ResourceAPI. Registered alongside ProductionSystem in GameSetup.ts's Simulation, with a new decay-only goldVault entity added to isolate decay behavior from production. Verified end to end in main.ts: production (25/sec) and decay (5/sec) both acting on the same gold resource in one tick produced the correct net result (200 gold after 10s), confirming systems run in registration order and interact correctly on shared state.

## Deferred / follow-up

- System clock resilience is partially handled with negative-time clamping and max elapsed caps.
- External or server-based time sources remain deferred until networking and save infrastructure are in place.
- Game-facing ergonomics for BigNumber: currently game definitions/setup must call `BigNumber.fromNumber(...)` explicitly (e.g. `buildings.ts`, `GameSetup.ts`). Considered allowing `number | BigNumber` at content-definition boundaries with normalization at the point content enters the engine, so games can write plain numbers. Deferred until a proper content-loading/registration system exists.
- Save migrations (Migration.ts) are deferred; SaveData.version exists and is stamped on every save, giving future migration logic something to key off, but no migration logic has been written yet.
- SaveEncoder's checksum is a non-cryptographic djb2 hash for corruption/tamper *detection* only, not prevention (a determined player can still recompute a valid checksum for edited data, since there's no secret key). True cryptographic hashing (e.g. Web Crypto SHA-256) was considered but deferred, since it would require making the save pipeline asynchronous and wouldn't add tamper-prevention anyway without server-side verification.
- Isolated runtime testing of DecaySystem's clamp-at-zero behavior was deferred, since createGame() doesn't currently support custom starting state/entities for testing. The clamp logic was verified by code review and by the production+decay net-rate test. A proper test suite (with the ability to construct custom test states) is planned as a future slice.

## Open items

- Migration
- EventSystem, FormulaSystem, ModifierSystem
- QueryAPI, GameAPI
- Formula, Value, Definitions
- Test suite (including support for constructing custom test states)

## Next focus

- Moving into Formula/Value/Definitions to support Upgrades — the bigger, more foundational design conversation that Slice 7's second-system validation was meant to de-risk.
