import { IsNumber, IsString } from "class-validator";
import { Loglevel } from "../enums";
import { BaseEntity } from "./base.entity";

export class DBLogEntity extends BaseEntity {
    @IsNumber()
    public loglevel: number = Loglevel.VERBOSE;
    @IsString()
    public context: string = "No context set";
    @IsString()
    public messages: string[] = [];
    @IsString()
    public processTitle: string = process.title;

    public plain(showPrivate: boolean = false): { [key: string]: any } {
        return {
            ...super.plain(),
            loglevel: this.loglevel,
            context: this.context,
            messages: this.messages,
            processTitle: this.processTitle,
        }
    }
}