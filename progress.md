# Progress

## Current status

- Completed the core engine slices up through offline progression.
- Verified deterministic simulation behavior and offline advancement end to end.

## Recently completed

- Implemented the engine foundation: GameState, Entity, ProductionComponent, EntityAPI, ComponentAPI, ResourceAPI, and ProductionSystem.
- Added a pluggable TimeSource abstraction and LocalTimeSource.
- Added offline progression support through Clock.advanceOffline() and Engine.loadOffline().
- Established a folder convention where interfaces live under their own interfaces/ subdirectory.

## Deferred / follow-up

- System clock resilience is partially handled with negative-time clamping and max elapsed caps.
- External or server-based time sources remain deferred until networking and save infrastructure are in place.

## Open items

- SaveManager, Serializer, Migration
- EventSystem, FormulaSystem, ModifierSystem
- QueryAPI, GameAPI
- BigNumber, Formula, Value, Definitions

## Next focus

- BigNumber integration is the recommended next slice, since resource values need it before formula and upgrade systems can be built on top of ResourceAPI.
