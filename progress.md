# Progress

## Current status

- Completed the core engine slices up through offline progression.
- Verified deterministic simulation behavior and offline advancement end to end.

## Recently completed

- Implemented the engine foundation: GameState, Entity, ProductionComponent, EntityAPI, ComponentAPI, ResourceAPI, and ProductionSystem.
- Added a pluggable TimeSource abstraction and LocalTimeSource.
- Added offline progression support through Clock.advanceOffline() and Engine.loadOffline().
- Established a folder convention where interfaces live under their own interfaces/ subdirectory.
- BigNumber integration is complete: GameState.resources, ProductionComponent.rate, ResourceAPI, and ProductionSystem all operate on BigNumber.

## Deferred / follow-up

- System clock resilience is partially handled with negative-time clamping and max elapsed caps.
- External or server-based time sources remain deferred until networking and save infrastructure are in place.
- Game-facing ergonomics for BigNumber: currently game definitions/setup must call `BigNumber.fromNumber(...)` explicitly (e.g. `buildings.ts`, `GameSetup.ts`). Considered allowing `number | BigNumber` at content-definition boundaries with normalization at the point content enters the engine, so games can write plain numbers. Deferred until a proper content-loading/registration system exists.

## Open items

- SaveManager, Serializer, Migration
- EventSystem, FormulaSystem, ModifierSystem
- QueryAPI, GameAPI
- BigNumber, Formula, Value, Definitions

## Next focus

- Next candidates: minimal save/load (Serializer/SaveManager), or a second system type to stress-test multi-system architecture.
