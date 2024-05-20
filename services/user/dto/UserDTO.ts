export interface NotificationOptions {
    enabled: boolean,
    token: string
}

export interface RegisterUserDTO {
    coordinates: number[];
    notification_options: NotificationOptions;
}

export interface EditUserDTO {
    coordinates?: number[];
    notification_options?: NotificationOptions;
}

export interface UserDTO {
    id: string;
    coordinates: number[];
    notification_options: NotificationOptions;
}
