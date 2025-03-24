import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EnumNotificationType } from "./enums/nofication-service.enums";

export class CreateNotificationServiceDto {
  
@IsNotEmpty()
@IsNumber()
user_id:number;


@IsNotEmpty()
@IsString()
message:string;

@IsNotEmpty()
@IsEnum(EnumNotificationType)
type:string;    
}
