export enum SELECTED_TYPES {
    SOLID_PLANET = 1,
    MOVING_PLANET = 2,
    SHIP = 3,
    SOLID_INVERTED_PLANET = 4,
    MOVE = 0,
}

export enum CONSTANTS {
    PLANET_DEFAULT_SIZE = 100000,
}

export class StaticValues {
    // update rates
    static ctrlRate: number = 100;
    static shiftRate: number = 100;
    static trailLifetime: number = 3000;
}
