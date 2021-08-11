import { classToPlain, Exclude, Expose, Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';
import { MongoObject } from '..';

export abstract class BaseEntity implements MongoObject {
	@Exclude({ toPlainOnly: true })
	@Transform(({ obj }) => obj?._id, { toClassOnly: true })
	_id: ObjectId;

	@IsDate()
	createdOn: Date;

	@IsDate()
	lastModifiedOn: Date;

	@IsOptional()
	@IsDate()
	removedOn?: Date;

	@Expose()
	public get id(): string {
		return this._id?.toHexString();
	}

	public set id(id: string) {
		if (!ObjectId.isValid(id)) return;
		this._id = new ObjectId(id);
	}

	public get className(): string {
		return this.constructor.name;
	}

	public set className(val: string) {
		// void
	}

	public toPlain(groups: string[]): Record<string, any> {
		return classToPlain(this, { groups });
	}
}
