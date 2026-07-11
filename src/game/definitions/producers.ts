import type { ProducerDefinition } from "../../engine/data/Definitions";
import { Value } from "../../engine/values/Value";
import { theNumber } from "./resources";

const costGrowth = 1.15;

function createProducerTier(
    id: string,
    name: string,
    baseRate: number,
    baseCost: number,
): ProducerDefinition {

    return {
        id,
        name,
        resource: theNumber.id,
        rate: Value.constant(baseRate),
        costs: [
            {
                resource: theNumber.id,
                amount: Value.fromFormula((level) => baseCost * costGrowth ** level)
            }
        ]
    };
}

export const productionUnit1 = createProducerTier("production_unit_1", "Production Unit I", 1, 10);
export const productionUnit2 = createProducerTier("production_unit_2", "Production Unit II", 8, 100);
export const productionUnit3 = createProducerTier("production_unit_3", "Production Unit III", 50, 1000);
export const productionUnit4 = createProducerTier("production_unit_4", "Production Unit IV", 300, 10000);