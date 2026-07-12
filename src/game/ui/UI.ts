import type { Engine } from "../../engine/core/Engine";
import type { ProducerDefinition, UpgradeDefinition } from "../../engine/data/Definitions";

import { ResourceAPI } from "../../engine/api/ResourceAPI";
import { ProducerAPI } from "../../engine/api/ProducerAPI";
import { UpgradeAPI } from "../../engine/api/UpgradeAPI";

import { theNumber } from "../definitions/resources";
import { allProducers, allUpgrades } from "../definitions/registry";

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

    container.classList.add("dashboard");

    // --- Resource readout ---
    const resourcePanel = document.createElement("div");
    resourcePanel.className = "resource-panel";

    const resourceLabelRow = document.createElement("div");
    resourceLabelRow.className = "resource-label-row";

    const resourceLabel = document.createElement("span");
    resourceLabel.className = "resource-label";
    resourceLabel.textContent = "Current Value";

    const liveDot = document.createElement("span");
    liveDot.className = "live-dot";
    liveDot.setAttribute("aria-hidden", "true");

    resourceLabelRow.appendChild(resourceLabel);
    resourceLabelRow.appendChild(liveDot);

    const resourceAmountEl = document.createElement("div");
    resourceAmountEl.className = "resource-value";
    resourceAmountEl.textContent = resourceAPI.get(engine.state, theNumber.id).toString();

    resourcePanel.appendChild(resourceLabelRow);
    resourcePanel.appendChild(resourceAmountEl);
    container.appendChild(resourcePanel);

    // --- Producers section ---
    const producerSection = document.createElement("div");
    producerSection.className = "section";

    const producerTitle = document.createElement("div");
    producerTitle.className = "section-title";
    producerTitle.textContent = "Producers";
    producerSection.appendChild(producerTitle);

    const producerList = document.createElement("div");
    producerList.className = "row-list";
    producerSection.appendChild(producerList);

    const producerRows: ProducerRow[] = [];

    for (const producer of allProducers){
        const rowEl = document.createElement("div");
        rowEl.className = "row";

        const nameEl = document.createElement("div");
        nameEl.className = "row-name";
        nameEl.textContent = producer.name;

        const quantityEl = document.createElement("div");
        quantityEl.className = "row-quantity";
        quantityEl.textContent = `${producerAPI.getCount(engine.state, producer.id)}`;

        const costEl = document.createElement("div");
        costEl.className = "row-cost";
        const nextCosts = producerAPI.getNextCosts(engine.state, producer);
        costEl.textContent = nextCosts.map(c => c.amount.toString()).join(", ");

        const buyButton = document.createElement("button");
        buyButton.className = "buy-button";
        buyButton.textContent = "Buy";
        buyButton.addEventListener("click", () => {
            engine.purchaseProducer(producer);
            render(engine, refs);
        });

        rowEl.appendChild(nameEl);
        rowEl.appendChild(quantityEl);
        rowEl.appendChild(costEl);
        rowEl.appendChild(buyButton);
        producerList.appendChild(rowEl);

        producerRows.push({
            definition: producer,
            quantityEl,
            costEl,
            buyButton
        });
    }

    container.appendChild(producerSection);

    // --- Upgrades section ---
    const upgradeSection = document.createElement("div");
    upgradeSection.className = "section";

    const upgradeTitle = document.createElement("div");
    upgradeTitle.className = "section-title";
    upgradeTitle.textContent = "Upgrades";
    upgradeSection.appendChild(upgradeTitle);

    const upgradeList = document.createElement("div");
    upgradeList.className = "row-list";
    upgradeSection.appendChild(upgradeList);

    const upgradeRows: UpgradeRow[] = [];

    for (const upgrade of allUpgrades){
        const rowEl = document.createElement("div");
        rowEl.className = "row";

        const labelEl = document.createElement("div");
        labelEl.className = "row-name";
        labelEl.textContent = upgrade.name;

        const costEl = document.createElement("div");
        costEl.className = "row-cost";
        const nextCosts = upgradeAPI.getNextCosts(engine.state, upgrade);
        costEl.textContent = nextCosts.map(c => c.amount.toString()).join(", ");

        const buyButton = document.createElement("button");
        buyButton.className = "buy-button";
        buyButton.textContent = "Buy";
        buyButton.addEventListener("click", () => {
            engine.purchaseUpgrade(upgrade);
            render(engine, refs);
        });

        rowEl.appendChild(labelEl);
        rowEl.appendChild(costEl);
        rowEl.appendChild(buyButton);
        upgradeList.appendChild(rowEl);

        upgradeRows.push({
            definition: upgrade,
            rowEl,
            costEl,
            buyButton
        });
    }

    container.appendChild(upgradeSection);

    refs = {
        resourceAmountEl,
        producerRows,
        upgradeRows
    };

    return refs;
}

export function render(engine: Engine, refs: UIRefs): void {
    refs.resourceAmountEl.textContent = resourceAPI.get(engine.state, theNumber.id).toString();

    for (const row of refs.producerRows){
        row.quantityEl.textContent = `${producerAPI.getCount(engine.state, row.definition.id)}`;

        const nextCosts = producerAPI.getNextCosts(engine.state, row.definition);
        row.costEl.textContent = nextCosts.map(c => c.amount.toString()).join(", ");
        row.buyButton.disabled = !producerAPI.canPurchase(engine.state, row.definition);
    }

    for (const row of refs.upgradeRows){
        const nextCosts = upgradeAPI.getNextCosts(engine.state, row.definition);
        row.costEl.textContent = nextCosts.map(c => c.amount.toString()).join(", ");

        const owned = row.definition.maxCount !== undefined
            && upgradeAPI.getCount(engine.state, row.definition.id) >= row.definition.maxCount;
        const affordable = upgradeAPI.canPurchase(engine.state, row.definition);

        row.buyButton.disabled = !affordable;
        row.buyButton.textContent = owned ? "Owned" : "Buy";
        row.rowEl.classList.toggle("owned", owned);
    }
}