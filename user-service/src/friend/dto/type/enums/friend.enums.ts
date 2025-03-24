import { Friend } from "../friend.type";

// Enum cho vai trò người dùng
export enum Role {
    USER = "USER",
    }
    
    // Enum cho trạng thái người dùng
    export enum Status {
      ACTIVE = "ACTIVE",      // Hoạt động
      INACTIVE = "INACTIVE",    // Không hoạt động
      BLOCKED = "BLOCKED",     // Bị khóa tài khoản
    }
    
export enum FriendStatus {
    SENT = "sent", // đã gửi
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    BLOCKED = "blocked",
    RECEIVED = "received", // đã nhận

}

