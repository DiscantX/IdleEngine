import type { UpgradeDefinition } from "../../engine/data/Definitions";
import { Value } from "../../engine/values/Value";
import { theNumber } from "./resources";

function createUpgrade(
    id: string,
    name: string,
    bonusPercent: number,
    baseCost: number,
): UpgradeDefinition {

    return {
        id,
        name,
        costs: [
            {
                resource: theNumber.id,
                amount: (Value.constant(baseCost))
            }
        ],
        maxCount: 1,
        modifiers: [
            {
            target: `production:${theNumber.id}`,
            operation: "multiplyAdditive",
            magnitude: Value.constant(bonusPercent)
            }
        ]
    };
}

export const upgradeTier1 = createUpgrade("upgrade_tier_1", "Upgrade Tier 1", 0.10, 50);
export const upgradeTier2 = createUpgrade("upgrade_tier_2", "Upgrade Tier 2", 0.15, 500);
export const upgradeTier3 = createUpgrade("upgrade_tier_3", "Upgrade Tier 3", 0.25, 5000);
export const upgradeTier4 = createUpgrade("upgrade_tier_4", "Upgrade Tier 4", 0.50, 50000);