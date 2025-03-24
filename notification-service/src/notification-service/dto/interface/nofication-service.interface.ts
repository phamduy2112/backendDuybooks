import { EnumNotificationType } from "../enums/nofication-service.enums";

export interface IPayloadNotification {
    id: number;
    userId: number;
    message?: string;
    type?: Uppercase<keyof typeof EnumNotificationType>; // lấy key của enum
    status: Lowercase<keyof typeof EnumNotificationType>; // lấy key của enum
    createdAt: Date;
  }
  