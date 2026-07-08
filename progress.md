# Progress

## Current status

- Completed the core engine slices up through minimal save/load.
- Verified deterministic simulation behavior, offline advancement, and full save/load round-tripping end to end.

## Recently completed

- Implemented the engine foundation: GameState, Entity, ProductionComponent, EntityAPI, ComponentAPI, ResourceAPI, and ProductionSystem.
- Added a pluggable TimeSource abstraction and LocalTimeSource.
- Added offline progression support through Clock.advanceOffline() and Engine.loadOffline().
- Established a folder convention where interfaces live under their own interfaces/ subdirectory.
- BigNumber integration is complete: GameState.resources, ProductionComponent.rate, ResourceAPI, and ProductionSystem all operate on BigNumber.
- Minimal save/load is complete: SaveData (versioned GameState wrapper), Serializer (GameState/SaveData <-> JSON, with generic BigNumber tagging via a replacer/reviver so it works anywhere in the state tree, not just resources), SaveEncoder (JSON <-> checksummed blob, base64 + djb2 checksum, throws on corruption/tamper detection), StorageAdapter interface + LocalStorageAdapter (pluggable persistence, same pattern as TimeSource), and SaveManager (orchestrates the pipeline, with saveKey/saveVersion passed in by the game rather than hardcoded by the engine). Engine now owns a SaveManager and exposes save()/load() facade methods.
- Verified end to end in main.ts: ticking a game, saving it, loading into a separate fresh instance, and confirming BigNumber values survive the round trip intact.

## Deferred / follow-up

- System clock resilience is partially handled with negative-time clamping and max elapsed caps.
- External or server-based time sources remain deferred until networking and save infrastructure are in place.
- Game-facing ergonomics for BigNumber: currently game definitions/setup must call `BigNumber.fromNumber(...)` explicitly (e.g. `buildings.ts`, `GameSetup.ts`). Considered allowing `number | BigNumber` at content-definition boundaries with normalization at the point content enters the engine, so games can write plain numbers. Deferred until a proper content-loading/registration system exists.
- Save migrations (Migration.ts) are deferred; SaveData.version exists and is stamped on every save, giving future migration logic something to key off, but no migration logic has been written yet.
- SaveEncoder's checksum is a non-cryptographic djb2 hash for corruption/tamper *detection* only, not prevention (a determined player can still recompute a valid checksum for edited data, since there's no secret key). True cryptographic hashing (e.g. Web Crypto SHA-256) was considered but deferred, since it would require making the save pipeline asynchronous and wouldn't add tamper-prevention anyway without server-side verification.

## Open items

- Migration
- EventSystem, FormulaSystem, ModifierSystem
- QueryAPI, GameAPI
- Formula, Value, Definitions

## Next focus

- Next candidates: a second system type (to stress-test multi-system architecture), or moving into Formula/Value/Definitions to support Upgrades.
