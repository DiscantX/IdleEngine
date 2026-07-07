export interface Entity {
    id: string;

    components: {
        [componentType: string]: object;
    };
}