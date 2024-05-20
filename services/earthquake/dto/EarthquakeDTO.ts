import {GeoPointLocationDTO} from "./GeoPointLocationDTO";

export interface EarthquakeDTO {
    id: string;
    coordinates: GeoPointLocationDTO;
    magnitude: number;
    place: string;
    time: Date;
    source: string;
    depth: number;
    earthquakeImage?: string;
    isoCode?: string;
    distance?: number;
}
