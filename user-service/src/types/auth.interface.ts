import { Role, Status } from "./enum/user.enum";

export type IPayLoadRegister = {
  email?: string;
  fullname?: string;
  password?: string;
  role?: Role;
  status?: Status;
};

export type TPayloadUser = {
  id: number; // SERIAL PRIMARY KEY, số nguyên tự tăng
  fullName?: string | null; // VARCHAR(50) NULL, cho phép NULL
  email?: string | null; // VARCHAR(100) NULL UNIQUE, cho phép NULL
  password?: string | null; // VARCHAR(255) NULL, cho phép NULL
  phoneNumber?: string | null; // VARCHAR(10) NULL, cho phép NULL
  avatarUrl?: string | null; // TEXT NULL, cho phép NULL
  nickName?: string | null; // VARCHAR(100) NULL, cho phép NULL
  birthDate?: Date | null; // DATE NULL, cho phép NULL
  marriageCondition?: string | null; // TEXT NULL, cho phép NULL
  role?: Role; // VARCHAR(50) DEFAULT 'customer'
  status?: Status; // VARCHAR(20) DEFAULT 'active'
  bio?: string | null; // TEXT NULL, cho phép NULL
  createdAt?: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
};