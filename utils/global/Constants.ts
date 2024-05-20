export const LOCATION_TASK_NAME = 'background-location-task';
export const QUAKELY_API_URL = process.env.EXPO_PUBLIC_QUAKELY_API_URL!;

export enum EarthquakeRegionType {
    LOCAL = "local",
    REGIONAL = "regional",
    GLOBAL = "global"
}

export enum EarthquakeType {
    PREDICTED = "PREDICTED",
    VERIFIED = "VERIFIED"
}
