import { FriendStatus } from "./enums/friend.enums";

export interface User {
    id: number;
    full_name?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    avatar_url?: string;
    nick_name?: string;
    birth_date?: Date;
    marriage_condition?: string;
    role?: string;
    status?: string;
    bio?: string;
    created_at?: Date;
  }
  
  export interface Friend {
    id: number;
    user_id: number;
    friend_id: number;
    status?: Uppercase<keyof typeof FriendStatus>; // lấy key của enum;
    created_at?: Date;
    user?: User; // Optional relation with user who sent the request
    friend?: User; // Optional relation with user who received the request
  }
  