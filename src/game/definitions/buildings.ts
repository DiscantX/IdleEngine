import { BigNumber } from "../../engine/values/BigNumber"

export const goldMine = {
    id: "goldMine",
    components: {
        production: {
            resource: "gold",
            rate: BigNumber.fromNumber(25)
        }
    }
};