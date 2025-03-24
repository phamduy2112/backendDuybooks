import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFriendDto {

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    friend_id: number;
}
