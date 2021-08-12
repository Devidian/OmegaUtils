import { CreateIndexesOptions, IndexSpecification } from 'mongodb';
import { of } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { BaseEntity } from '../entities/base.entity';
import { ExtendedLogger } from '../tools';
import { mongoClient } from '../tools/mongoClient';
import { MongoCollection } from '../tools/MongoCollection';

export function DatabaseCollection<T extends BaseEntity>(
	collectionName: string,
	classFactory: new (item?: T) => T,
	classFilter = false,
	indices: { spec: IndexSpecification; options?: CreateIndexesOptions }[] = [],
): any {
	const logger = new ExtendedLogger(`DatabaseCollectionDecorator`);
	return async (target: Object, propertyKey: string) => {
		const factories: { [key: string]: new (item?: T) => T } = {};
		factories[classFactory.name] = classFactory;
		let collectionRef: MongoCollection<T> = null;
		mongoClient.pipe(filter((x) => !!x)).subscribe(async (val) => {
			if (val && !collectionRef) {
				collectionRef = (() => new MongoCollection<T>(factories, collectionName, classFilter))();
				if (indices.length > 0) {
					collectionRef.$collection.pipe(first((f) => !!f)).subscribe((col) => {
						for (const index of indices) {
							col.createIndex(index.spec, index.options || {}).catch((e) => {
								void logger.error(e);
							});
						}
					});
				}
			}
		});
		Object.defineProperty(target, propertyKey, {
			get: () => collectionRef || { $isReady: of(false) },
		});
	};
}
