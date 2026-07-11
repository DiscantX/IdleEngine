# Idle Game Engine - Design Document

## Project Goal

Create a reusable idle game engine in TypeScript that serves as the foundation for multiple future idle game projects.

The engine should provide generic systems for simulation, resources, progression, saving/loading, and content definitions while remaining completely independent of any specific game.

A simple sample game will be built alongside the engine to validate architectural decisions and demonstrate engine usage.

---

# Core Design Principles

## Engine Owns Systems, Games Own Content

The engine defines:

* System behavior
* Simulation rules
* APIs
* Data structures
* Save infrastructure
* Formula evaluation

Games define:

* Resources
* Buildings
* Upgrades
* Pets
* Research
* Content data

Example:

Engine:

```typescript
export interface ProductionComponent {
    resource: string;
    rate: number;
}
```

Game:

```typescript
export const goldMine = {
    id: "goldMine",
    components: {
        production: {
            resource: "gold",
            rate: 10
        }
    }
};
```

The engine must never contain game-specific concepts such as:

* gold
* wood
* mine
* dragon
* pet

---

## Data-Driven Architecture

Where practical:

* Formulas are data.
* Content is data.
* Definitions are data.
* Systems operate on data.

Prefer:

```typescript
{
    production: {
        resource: "gold",
        rate: 10
    }
}
```

over hardcoded logic.

---

## Instructions

I'm learning TypeScript as I go, so please act as both co-coder and instructor: explain concepts, give precise file/directory names and exact locations for edits, and let me write the code myself rather than generating full files for me. Go one step at a time and check my work before moving on.

---

## Everything Goes Through APIs

Systems should not directly manipulate arbitrary state.

Examples:

```typescript
ResourceAPI
EntityAPI
ComponentAPI
```

Future APIs may include:

```typescript
FormulaAPI
SaveAPI
UpgradeAPI
EventAPI
```

---

---

## Extending Definitions with Game-Specific Metadata

The engine's `Definition` interface (and the types that extend it, like
`UpgradeDefinition` and `BuildingDefinition`) intentionally stays minimal —
just the fields every piece of content universally needs (`id`, `name`,
`description?`).

When a specific game needs additional display or gameplay metadata beyond
that — icon paths, rarity tiers, sound effect IDs, etc. — the convention is
to **extend the relevant Definition interface in game code**, the same way
`UpgradeDefinition extends Definition`:

```typescript
interface GameUpgradeDefinition extends UpgradeDefinition {
    icon: string;
    rarity: "common" | "rare" | "legendary";
}
```

This was chosen deliberately over adding a generic `metadata: { [key: string]: string }`
bag to `Definition` itself. A typed extension gives compile-time safety
(typos become build errors, not silent runtime bugs) and keeps the engine
from having to anticipate every possible piece of game-specific metadata —
consistent with the project's broader preference for typed, structured data
over open-ended generic containers (see also: the function-based `Formula`
decision, which rejected a data-driven/tagged-interpreter approach for
similar reasons).

## Deterministic Simulation

Given:

* identical starting state
* identical inputs
* identical elapsed time

the simulation must always produce the same result.

Example:

```text
State A
+ 100 seconds
=
Result X

State A
+ 100 seconds
=
Result X
```

Determinism is required for:

* offline progress
* testing
* balancing
* debugging
* save consistency

---

# Architecture Direction

## Hybrid ECS

The project uses a hybrid Entity Component System approach.

Not a pure ECS.

Entities are lightweight containers.

Components contain data.

Systems process components.

Game-specific behavior remains data-driven.

---

# Current Folder Structure

```text
src
├─ engine
│  ├─ api
│  ├─ core
│  ├─ data
│  ├─ formulas
│  ├─ save
│  └─ systems
│
├─ game
│  ├─ definitions
│  └─ GameSetup.ts
│
├─ ui
│
└─ main.ts
```

---

# Current Core Types

## GameState

```typescript
export interface GameState {
    time: number;

    resources: {
        [resourceId: string]: number;
    };

    entities: {
        [entityId: string]: Entity;
    };
}
```

Current implementation uses number.

Resources are expected to migrate to a BigNumber/Decimal type later.

---

## Entity

```typescript
export interface Entity {
    id: string;

    components: {
        [componentType: string]: object;
    };
}
```

---

## ProductionComponent

```typescript
export interface ProductionComponent {
    resource: string;
    rate: number;
}
```

---

# Existing APIs

## ResourceAPI

Responsible for resource modification.

Example:

```typescript
resourceAPI.add(
    state,
    "gold",
    10
);
```

---

## EntityAPI

Responsible for entity creation.

Example:

```typescript
entityAPI.create(
    "mine_001",
    components
);
```

Rationale:

Games should not construct engine entities directly.

Future responsibilities may include:

* validation
* migrations
* metadata
* unique ID generation

---

## ComponentAPI

Responsible for component retrieval.

Example:

```typescript
componentAPI.get<ProductionComponent>(
    entity,
    "production"
);
```

Rationale:

Systems should not directly access component storage.

---

# Simulation Philosophy

## Mathematical Advancement First

Idle games should advance using mathematical calculations whenever possible.

Example:

Preferred:

```typescript
gold += rate * elapsedTime;
```

Avoid:

```typescript
for (...)
{
    produceGold();
}
```

for large elapsed times.

---

## Do Not Simulate Every Tick

Offline advancement may involve:

```text
100000 seconds
```

The engine must not require:

```text
100000
```

or

```text
10000000
```

individual simulation steps.

---

## State Transitions vs Continuous Processes

The project currently distinguishes between:

### Continuous Processes

Examples:

* resource generation
* experience gain
* passive income

Can generally advance analytically.

---

### State Transitions

Examples:

* research completion
* construction completion
* production multiplier changes

These change future simulation behavior and may require interruption points.

---

## Important Open Question

Avoid designing around the assumption that "events are rare."

Late-game idle mechanics may generate enormous numbers of actions.

Examples:

* millions of upgrades
* extremely short cooldowns
* automated purchases
* mass spawning

The engine should prefer:

* mathematical solutions
* batching
* analytical advancement

over individual event processing.

---

# Planned Simulation Architecture

Direction only; not finalized.

```text
Engine
    |
    v
Simulation
    |
    +-------------------+
    |                   |
ProductionSystem   Future Systems
    |
    v
GameState
```

Simulation should orchestrate systems.

Systems should own their dependencies.

Example:

```typescript
const productionSystem =
    new ProductionSystem(
        componentAPI,
        resourceAPI
    );
```

rather than passing APIs through update calls.

---

# Big Number Strategy

Not implemented yet.

Expected future direction:

Resources:

```typescript
Decimal
BigNumber
```

Time:

```typescript
number
```

Reasoning:

Resource values can become astronomically large.

Simulation time is unlikely to require arbitrary precision.

Final library choice remains undecided.

---

# Coding Standards

## TypeScript Style

Use standard idiomatic TypeScript formatting.

Preferred:

```typescript
export const goldMine = {
    id: "goldMine",
    components: {
        production: {
            resource: "gold",
            rate: 10
        }
    }
};
```

Avoid excessive explanatory whitespace.

---

## Type-Only Imports

When importing interfaces or types:

```typescript
import type { GameState } from "./GameState";
```

---

## Avoid Parameter Properties

Do not use:

```typescript
constructor(
    private api: ResourceAPI
) {}
```

Use:

```typescript
private api: ResourceAPI;

constructor(api: ResourceAPI) {
    this.api = api;
}
```

Reason:

Project uses strict TypeScript settings including erasableSyntaxOnly.

---

# Current Vertical Slice Status

## Completed

* GameState
* Entity model
* ProductionComponent
* EntityAPI
* ComponentAPI
* ResourceAPI
* First game definition (goldMine)
* ProductionSystem (in progress refactor)
* Data-driven entity creation

## Active Work

Simulation architecture refactor.

Current objective:

Create a generic SimulationSystem contract and make Simulation operate on registered systems rather than specific system types.

---

# Major Future Systems

Potential future engine modules:

* Formula System
* Save System
* Offline Progress
* Upgrades
* Research
* Automation
* Achievements
* Prestige
* Combat
* Pets
* Statistics
* Modding Support

These should be implemented as engine systems rather than hardcoded game logic whenever practical.
