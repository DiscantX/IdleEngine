import type { UpgradeDefinition } from "../../engine/data/Definitions";
import { Value } from "../../engine/values/Value";

/**
 * Defines the Mining Speed upgrade
 */
export const miningSpeed: UpgradeDefinition = {
    id: "mining_speed",
    name: "Mining Speed",
    description: "Miners mine faster.",
    costs: [
        {
            resource: "gold",
            amount: Value.constant(10)
        }
    ],
    modifiers: [
        {
            target: "production:gold",
            operation: "multiplyAdditive",
            magnitude: Value.constant(0.10)
        }
    ]
};