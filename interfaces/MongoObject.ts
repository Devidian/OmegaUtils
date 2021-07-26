import { ObjectId } from "mongodb";

export interface MongoObject {
	_id: ObjectId;
	createdOn: Date | null;
	lastModifiedOn: Date | null;
	removedOn?: Date | null;		// if this is set, the object has been removed / deleted
	className: string;				// if this is set, the object can have multiple classes to instanciate it
}