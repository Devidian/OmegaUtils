import { IsNumber, IsString } from "class-validator";
import { Loglevel } from "../enums";
import { BaseEntity } from "./base.entity";

export class DBLogEntity extends BaseEntity {
    @IsNumber()
    public loglevel: number = Loglevel.VERBOSE;
    @IsString()
    public context = "No context set";
    @IsString()
    public messages: string[] = [];
    @IsString()
    public processTitle: string = process.title;
}