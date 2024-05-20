import {RegisterUserDTO, UserDTO} from "./dto/UserDTO";
import {QUAKELY_API_URL} from "../../utils/global/Constants";
import {BaseResponse} from "../BaseResponse";

export class UserService {
    static createUser = async (info: RegisterUserDTO): Promise<BaseResponse<UserDTO>> => {
        console.log(JSON.stringify(info));

        const user = await fetch(QUAKELY_API_URL + "/users/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(info)
        });

        if(user.ok) {
            return await user.json() as BaseResponse<UserDTO>;
        }

        throw new Error("An error occurred whilst creating the user.");
    }
}
