import { ObjectId } from 'mongodb';

export interface MongoObject {
	_id: ObjectId;
	createdOn: Date;
	lastModifiedOn: Date;
	removedOn?: Date; // if this is set, the object has been removed / deleted
	className: string; // if this is set, the object can have multiple classes to instanciate it
}
