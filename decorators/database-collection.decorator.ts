import { IndexSpecification } from 'mongodb';
import { of } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { BaseEntity } from '../entities/base.entity';
import { mongoClient } from '../tools/mongoClient';
import { MongoCollection } from '../tools/MongoCollection';

export function DatabaseCollection<T extends BaseEntity>(
	collectionName: string,
	classFactory: new (item?: T) => T,
	classFilter = false,
	indices: IndexSpecification[] = [],
): any {
	return async (target: Object, propertyKey: string) => {
		const factories: { [key: string]: new (item?: T) => T } = {};
		factories[classFactory.name] = classFactory;
		let collectionRef: MongoCollection<T> = null;
		mongoClient.pipe(filter((x) => x?.isConnected())).subscribe(async (val) => {
			if (val && !collectionRef) {
				collectionRef = (() => new MongoCollection<T>(factories, collectionName, classFilter))();
				if (indices.length > 0) {
					collectionRef.$collection.pipe(first((f) => !!f)).subscribe((col) => {
						col.createIndexes(indices);
					});
				}
			}
		});
		Object.defineProperty(target, propertyKey, {
			get: () => collectionRef || { $isReady: of(false) },
		});
	};
}
