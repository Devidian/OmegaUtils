import { ChangeStream, ChangeStreamOptions, ObjectId } from 'mongodb';
import { BaseEntity } from '../entities';
import { ExtendedLogger } from '../tools/ExtendedLogger';
import { MongoCollection } from '../tools/MongoCollection';

export abstract class BaseRepository<T extends BaseEntity> {
	protected abstract collectionRef: MongoCollection<T>;
	protected abstract logger: ExtendedLogger;

	public get isReady(): Promise<boolean> {
        return this.collectionRef.$isReady.toPromise();
	}

	public watch(pipeline?: object[], options?: ChangeStreamOptions): Promise<ChangeStream> {
		return this.collectionRef.watch(pipeline, options);
	}

	public getAll(): Promise<T[]> {
		return this.collectionRef.getAll();
	}

	public findItemById(id: string): Promise<T> {
		if (!ObjectId.isValid(id)) {
			throw new Error('Property id is not a valid ObjectId');
		}
		const _id = new ObjectId(id + '');
		return this.collectionRef.findItemById(_id);
	}

	public findItemsByIds(idList: string[]): Promise<T[]> {
		if (idList.some((id) => !ObjectId.isValid(id))) {
			throw new Error('Property id is not a valid ObjectId');
		}
		const oids = idList.map((id) => new ObjectId(id + ''));
		//@ts-ignore
		return this.collectionRef.findItems({ _id: { $in: oids } });
	}

	public softRemoveById(id: string) {
		if (!ObjectId.isValid(id)) {
			throw new Error('Property id is not a valid ObjectId');
		}
		const _id = new ObjectId(id + '');
		//@ts-ignore
		return this.collectionRef.softRemove({ _id });
	}

	public save(entity: T): Promise<T> {
		if (this.collectionRef) {
			return this.collectionRef.save(entity);
		} else {
			this.logger.warn('save()', 'collection reference not found.');
			return Promise.resolve(entity);
		}
	}
}
