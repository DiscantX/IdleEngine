import type { Engine } from "../engine/core/Engine";
import type { ProducerDefinition, UpgradeDefinition } from "../engine/data/Definitions";

import { ResourceAPI } from "../engine/api/ResourceAPI";
import { ProducerAPI } from "../engine/api/ProducerAPI";
import { UpgradeAPI } from "../engine/api/UpgradeAPI";

import { theNumber } from "../game/definitions/resources";
import { allProducers, allUpgrades } from "../game/definitions/registry";

const resourceAPI = new ResourceAPI();
const producerAPI = new ProducerAPI(resourceAPI);
const upgradeAPI = new UpgradeAPI(resourceAPI);

interface ProducerRow {
    definition: ProducerDefinition;
    quantityEl: HTMLElement;
    costEl: HTMLElement;
    buyButton: HTMLButtonElement;
}

interface UpgradeRow {
    definition: UpgradeDefinition;
    rowEl: HTMLElement;
    costEl: HTMLElement;
    buyButton: HTMLButtonElement;
}

interface UIRefs {
    resourceAmountEl: HTMLElement;
    producerRows: ProducerRow[];
    upgradeRows: UpgradeRow[];
}

export function setupUI(engine: Engine, container: HTMLElement): UIRefs {
    let refs: UIRefs;

    const resourceAmountEl = document.createElement("div");
    resourceAmountEl.textContent = `${theNumber.name}: ${resourceAPI.get(engine.state, theNumber.id).toString()}`;
    container.appendChild(resourceAmountEl);

    const producerRows: ProducerRow[] = [];
    const upgradeRows: UpgradeRow[] = [];

    const producer = allProducers[0];

    const quantityEl = document.createElement("div");
    quantityEl.textContent = `${producer.name}: ${producerAPI.getQuantity(engine.state, producer.id)}`;

    const costEl = document.createElement("div");
    costEl.textContent = "Cost: ...";

    const buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.addEventListener("click", () => {
        engine.purchaseProducer(producer);
        render(engine, refs);
    });

    container.appendChild(quantityEl);
    container.appendChild(costEl);
    container.appendChild(buyButton);

    producerRows.push({
        definition: producer,
        quantityEl,
        costEl,
        buyButton
    });

    refs = {
        resourceAmountEl,
        producerRows,
        upgradeRows
    };

    return refs;
}

export function render(engine: Engine, refs: UIRefs): void {

}