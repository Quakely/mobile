import {EarthquakeRegionType, EarthquakeType, QUAKELY_API_URL} from "../../utils/global/Constants";
import {BaseResponse, PaginationResponse} from "../BaseResponse";
import {QuakelyStorageKeys} from "../../utils/storage/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {EarthquakeDTO} from "./dto/EarthquakeDTO";

export class EarthquakeService {
    static getPaginatedEarthquakes = async (regionType: EarthquakeRegionType, pageNumber: number): Promise<BaseResponse<PaginationResponse<EarthquakeDTO[]>>> => {
        const authKey = await AsyncStorage.getItem(QuakelyStorageKeys.QUAKELY_USER_KEY);

        const earthquakes = await fetch(QUAKELY_API_URL + `/earthquakes/verified/paginated?page=${pageNumber}&size=10&region=${regionType}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': authKey!
            }
        });

        if(earthquakes.ok) {
            return await earthquakes.json() as BaseResponse<PaginationResponse<EarthquakeDTO[]>>;
        }

        throw new Error("An error occurred whilst fetching the earthquakes.");
    }
    static getPredictedEarthquakes = async (regionType: EarthquakeRegionType, pageNumber: number): Promise<BaseResponse<PaginationResponse<EarthquakeDTO[]>>> => {
        const authKey = await AsyncStorage.getItem(QuakelyStorageKeys.QUAKELY_USER_KEY);

        const earthquakes = await fetch(QUAKELY_API_URL + `/earthquakes/predicted/paginated?page=${pageNumber}&size=10&region=${regionType}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': authKey!
            }
        });

        if(earthquakes.ok) {
            return await earthquakes.json() as BaseResponse<PaginationResponse<EarthquakeDTO[]>>;
        }

        throw new Error("An error occurred whilst fetching the earthquakes.");
    }
    static getMapEarthquakes = async (earthquakeType: EarthquakeType[], lat_min: number, lat_max: number, lon_min: number, lon_max: number): Promise<BaseResponse<EarthquakeDTO[]>> => {
        const authKey = await AsyncStorage.getItem(QuakelyStorageKeys.QUAKELY_USER_KEY);

        const earthquakes = await fetch(QUAKELY_API_URL +
            `/earthquakes/map/?lat_min=${lat_min}&lat_max=${lat_max}&lng_min=${lon_min}&lng_max=${lon_max}&types=${earthquakeType.join(",")}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': authKey!
            }
        });

        if(earthquakes.ok) {
            return await earthquakes.json() as BaseResponse<EarthquakeDTO[]>;
        }

        console.log(earthquakes.status)

        throw new Error("An error occurred whilst fetching the earthquakes.");
    }
}
