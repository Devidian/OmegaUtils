import { IsDate, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { MongoObject } from "..";

export abstract class BaseEntity implements MongoObject {

	_id: ObjectId = new ObjectId();

	@IsDate()
	createdOn: Date | null = null;

	@IsDate()
	lastModifiedOn: Date | null = null;

	@IsOptional()
	@IsDate()
	removedOn?: Date | null | undefined = null;

	public get id(): string {
		return this._id + '';
	}

	public get className(): string {
		return this.constructor.name;
	}

	public set className(val: string) {
		// void
	}

	public plain(showPrivate: boolean = false): { [key: string]: any } {
		return {
			id: this.id,
			createdOn: this.createdOn,
			lastModifiedOn: this.lastModifiedOn,
			...(this.removedOn ? { removedOn: this.removedOn } : null),
			className: this.className
		}
	}
}