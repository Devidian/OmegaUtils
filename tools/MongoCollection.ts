import { plainToClass } from 'class-transformer';
import { isNotEmptyObject } from 'class-validator';
import { createHmac } from 'crypto';
import {
	ChangeStream,
	ChangeStreamOptions,
	Collection,
	CommonOptions,
	DeleteWriteOpResultObject,
	FilterQuery,
	MongoClient,
	ObjectId,
	ReplaceOneOptions,
	UpdateQuery,
	UpdateWriteOpResult,
} from 'mongodb';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { types } from 'util';
import { MongoDB } from '../decorators/mongodb.decorator';
import { BaseEntity } from '../entities/base.entity';
import { EnvVars } from '../enums';
import { Environment } from './Environment';

/** Help Class with general methods
 *
 * @param {type} Database
 * @returns {MongoCollection}
 */
export class MongoCollection<TC extends BaseEntity> {
	protected Options = { all: {} };
	protected defaultFactory: ClassType<TC>;
	@MongoDB
	private $dbConnection: Observable<MongoClient>;

	private logger = {
		error: (...args: any[]) => {},
	};

	public $collection: Observable<Collection<TC>>;

	public collection: Collection<TC> = null;

	public $isReady: Observable<boolean>;

	/**
	 * Creates an instance of MongoCollection.
	 * @param {Db} Database
	 * @memberof MongoCollection
	 */
	constructor(
		protected factories: { [key: string]: new (item?: TC) => TC },
		private collectionName: string,
		private useClassFilter: boolean = false,
	) {
		this.$collection = this.$dbConnection.pipe(
			map((v) => v?.db().collection<TC>(this.collectionName)),
			filter((f) => !!f),
		);
		this.$collection.subscribe((c) => {
			this.collection = c;
		});
		this.$isReady = this.$collection.pipe(map((c) => !!c));
		this.defaultFactory = factories[Object.getOwnPropertyNames(factories)[0]];
		this.init();
	}

	private async init() {
		this.logger = new (await import('./ExtendedLogger')).ExtendedLogger(
			MongoCollection.name + '.' + this.collectionName,
		);
	}

	protected dynamicClass(name: string) {
		return this.factories[name];
	}

	/**
	 * default save document method (override if you need somethng special)
	 * uses updateOne with upsert to save document
	 *
	 * @param {*} doc
	 * @returns {Promise<TC>}
	 *
	 * @memberof MongoDB
	 */
	public save(doc: TC): Promise<TC | null> {
		const N = new Date();
		// ensure ObjectID
		doc._id =
			ObjectId.isValid(doc._id) && new ObjectId(doc._id + '') + '' == doc._id + ''
				? new ObjectId(doc._id + '')
				: doc._id; // in case of a valid object id that was incorrectly string, convert it
		if (!doc._id) {
			doc._id = new ObjectId();
		}
		doc.createdOn = doc.createdOn || N;

		return this.atomicSave({ ...doc, className: doc.className });
	}

	/**
	 *
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {Promise<UpdateWriteOpResult>}
	 * @memberof MongoCollection
	 */
	public async softRemove(Filter: FilterQuery<TC>): Promise<UpdateWriteOpResult> {
		const now = new Date();
		const uq: UpdateQuery<TC> = { $set: { removedOn: now } } as any;
		return this.collection.updateMany(Filter, uq);
	}

	/**
	 *
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {Promise<UpdateWriteOpResult>}
	 * @memberof MongoCollection
	 */
	public async restore(Filter: FilterQuery<TC>): Promise<UpdateWriteOpResult> {
		return this.collection.updateMany(Filter, { $unset: { removedOn: 1 } } as any);
	}

	/**
	 *
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {Promise<DeleteWriteOpResultObject>}
	 * @memberof MongoCollection
	 */
	public async hardRemove(Filter: FilterQuery<TC>): Promise<DeleteWriteOpResultObject> {
		return this.collection.deleteMany(Filter);
	}

	/**
	 *
	 *
	 * @protected
	 * @param {string} key
	 * @param {{ [key: string]: any }} nDoc
	 * @param {{ [key: string]: any }} oDoc
	 * @returns {any[]}
	 * @memberof MongoCollection
	 */
	protected deepUpdate(key: string, nDoc: { [key: string]: any }, oDoc: { [key: string]: any }): any[] {
		let result = [];
		for (const prop in nDoc) {
			try {
				let upKey = key + '.' + prop;
				if (nDoc.hasOwnProperty(prop)) {
					const isObjectID = ObjectId.isValid(nDoc[prop]); //  && nDoc[prop].length > 12
					if (!oDoc || !oDoc[prop]) {
						result.push({ path: upKey, value: nDoc[prop] });
					} else if (!oDoc[prop] || isObjectID || types.isDate(nDoc[prop])) {
						// respect ObjectID an Date
						if (oDoc[prop] != nDoc[prop]) {
							result.push({ path: upKey, value: nDoc[prop] });
						}
					} else if (Array.isArray(nDoc[prop])) {
						if (JSON.stringify(oDoc[prop]) != JSON.stringify(nDoc[prop])) {
							result.push({ path: upKey, value: nDoc[prop] });
						}
					} else if (nDoc[prop] !== null && typeof nDoc[prop] === 'object') {
						// nDoc[prop] is an object
						this.deepUpdate(upKey, nDoc[prop], oDoc[prop]).forEach((element) => {
							result.push(element);
						});
					} else if (!oDoc || !oDoc.hasOwnProperty(prop) || oDoc[prop] === undefined || oDoc[prop] != nDoc[prop]) {
						// oDoc has no prop with this key or it is unequal but not an object
						result.push({ path: upKey, value: nDoc[prop] });
					} else {
						// nDoc[prop] is not an object, oDoc has this property and it is equal
					}
				}
			} catch (error) {
				this.logger.error(`[MongoCollection::deepUpdate]`, error);
			}
		}
		return result;
	}

	/**
	 *
	 *
	 * @protected
	 * @param {*} nDoc new Document
	 * @param {*} oDoc old Document
	 * @returns {Promise<any>}
	 * @memberof MongoCollection
	 */
	protected createUpdate(nDoc: { [key: string]: any }, oDoc: { [key: string]: any }): Promise<any> {
		let target: { [key: string]: any } = {};
		for (const key in nDoc) {
			if (nDoc.hasOwnProperty(key)) {
				const isObjectID = ObjectId.isValid(nDoc[key]); // && nDoc[key].length > 12;
				if (!oDoc[key] || isObjectID || types.isDate(nDoc[key])) {
					if (oDoc[key] != nDoc[key]) {
						target[key] = nDoc[key];
					}
				} else if (Array.isArray(nDoc[key])) {
					if (JSON.stringify(oDoc[key]) != JSON.stringify(nDoc[key])) {
						target[key] = nDoc[key];
					}
				} else if (nDoc[key] !== null && typeof nDoc[key] === 'object') {
					// nDoc[key] is an object
					this.deepUpdate(key, nDoc[key], oDoc[key]).forEach((element) => {
						target[element.path] = element.value;
					});
				} else if (!oDoc || !oDoc.hasOwnProperty(key) || oDoc[key] === undefined || oDoc[key] != nDoc[key]) {
					// oDoc has no prop with this key or it is unequal but not an object
					target[key] = nDoc[key];
				} else {
					// nDoc[key] is not an object, oDoc has this property and it is equal
				}
			}
		}
		return Promise.resolve(target);
	}

	/**
	 * creates an atomic update, instead of updating the complete document,
	 * only changes will be updated even in deep objects
	 *
	 * property:{a:{b:c}} becomes
	 * 'property.a.b' = c
	 *
	 * @param {*} doc2save
	 * @returns {Promise<TC>}
	 * @memberof MongoCollection
	 */
	public atomicSave(doc2save: TC): Promise<TC | null> {
		// let isUpdate = false;
		return this.findItemById(doc2save._id)
			.then((doc: TC | null) => {
				if (doc) {
					let from: any = Object.assign({}, doc2save);
					delete from._id;
					return this.createUpdate(from, doc);
				} else {
					delete doc2save.removedOn; // this is never set on first save
					return doc2save;
				}
			})
			.then((to) => {
				var oQuery: FilterQuery<any> = {
					_id: doc2save._id,
				};
				let mod = Object.assign({}, to);

				delete mod._id;
				delete mod.createdOn; // ignore value because its set on first save and should never change again
				delete mod.lastModifiedOn; // ignore value because its set on save
				// delete mod.class; // ignore value because its set on first save and should never change again

				if (mod.removedOn === null) {
					delete mod.removedOn;
				}

				let fields = 0;
				for (const key in mod) {
					if (mod.hasOwnProperty(key)) {
						fields++;
					}
				}
				let SOI = Object.assign(to.class ? { class: to.class } : {}, oQuery, { createdOn: new Date() });
				mod.lastModifiedOn = new Date();

				return fields
					? this.updateOne(oQuery, { $setOnInsert: SOI, $set: mod }, { upsert: true }).then(
							(i) => this.toObject(i) as TC,
					  )
					: this.findItemById(doc2save._id);
			});
	}

	/**
	 * passthrough updateOne method with object response
	 *
	 *
	 * @param {FilterQuery<T>} filter
	 * @param {Object} update
	 * @param {ReplaceOneOptions} [options]
	 * @returns {Promise<T>}
	 * @memberof MongoCollection
	 */
	public async updateOne(filter: FilterQuery<any>, update: Object, options?: ReplaceOneOptions): Promise<TC | null> {
		return (
			this.collection
				.updateOne(filter, update, options || { upsert: true })
				// .catch((E) => {
				// 	if (E.code == 11000) {
				// 		Logger(911, '[updateOne]', `[${this.collection.collectionName}]`, E.message, '[CATCHED]');
				// 		// return true;
				// 	} else {
				// 		Logger(911, '[updateOne]', `[${this.collection.collectionName}]`, E.message);
				// 		// throw "Error on update One";
				// 	}
				// 	throw E;
				// })
				.then(() => {
					return this.findItem(filter);
				})
		);
	}

	/**
	 * passthrough updateMany method for current collection
	 *
	 * @param {FilterQuery<TC>} filter
	 * @param {Object} update
	 * @param {(CommonOptions & { upsert?: boolean })} [options]
	 * @returns {Promise<UpdateWriteOpResult>}
	 * @memberof MongoCollection
	 */
	public async updateMany(
		filter: FilterQuery<TC>,
		update: Object,
		options?: CommonOptions & { upsert?: boolean },
	): Promise<UpdateWriteOpResult> {
		return this.collection.updateMany(filter, update, options);
	}

	/**
	 * Count all Documents
	 *
	 * @returns {Promise<number>}
	 *
	 * @memberof MongoDB
	 */
	public countAll(): Promise<number> {
		return this.countItems({});
	}

	/**
	 * Counts documents after filtering
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {Promise<number>}
	 * @memberof MongoCollection
	 */
	public async countItems(Filter: FilterQuery<TC>): Promise<number> {
		return this.collection.countDocuments(Filter, {});
	}

	/**
	 * Fetch all Documents
	 *
	 * @returns {Promise<TC[]>}
	 * @memberof MongoCollection
	 */
	public getAll(): Promise<TC[]> {
		return this.findItems({});
	}

	/**
	 *
	 *
	 * @protected
	 * @param {FilterQuery<TC>} Filter
	 * @returns {FilterQuery<TC>}
	 * @memberof MongoCollection
	 */
	protected classFilter(Filter: FilterQuery<TC>): FilterQuery<TC> {
		let f = Filter;
		if (this.useClassFilter) {
			const item = new this.defaultFactory();
			if (item.className) {
				f = Object.assign({ class: item.className }, Filter);
			}
		}
		return f;
	}

	/**
	 * get items matching the Filter (wrapper for find)
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {Promise<TC[]>}
	 * @memberof MongoCollection
	 */
	public async findItems(Filter: FilterQuery<TC>): Promise<TC[]> {
		if (isNotEmptyObject(Filter)) {
			return this.collection
				.find(this.classFilter(Filter))
				.toArray()
				.then((a) => this.toObject(a) as TC[]);
		} else {
			return this.collection
				.find(this.classFilter(Filter))
				.limit(500)
				.toArray()
				.then((a) => this.toObject(a) as TC[]);
		}
	}

	/**
	 * gets a single item by its unique _id
	 *
	 * @param {(ObjectId)} objectId
	 * @returns {Promise<T>}
	 *
	 * @memberof MongoDB
	 */
	public async findItemById(uid: ObjectId): Promise<TC | null> {
		// ensure ObjectID is always an ObjectID even when it was received as string
		if (typeof uid === 'string' && ObjectId.isValid(uid)) {
			uid = new ObjectId(uid);
		}

		return this.collection
			.findOne<TC>(this.classFilter({ _id: uid } as FilterQuery<TC>))
			.then((item) => this.toObject(item) as TC);
	}

	/**
	 * find a single item (first matching) by FilterQuery (wrapper for findOne)
	 *
	 * @param {FilterQuery<TC>} Filter
	 * @returns {(Promise<TC | null>)}
	 * @memberof MongoCollection
	 */
	public async findItem(Filter: FilterQuery<TC>): Promise<TC | null> {
		try {
			const item = await this.collection.findOne<TC>(this.classFilter(Filter));
			return this.toObject(item) as TC;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
	 *
	 * @param {*} [pipeline]
	 * @param {ChangeStreamOptions} [options]
	 * @returns {Promise<ChangeStream<TC>>}
	 * @memberof MongoCollection
	 */
	public async watch(pipeline?: object[], options?: ChangeStreamOptions): Promise<ChangeStream<TC>> {
		const opt = Object.assign({}, { readPreference: 'secondaryPreferred' }, options || {});
		return this.collection.watch<TC>(pipeline || [], opt);
	}

	/**
	 *
	 *
	 * @static
	 * @param {any} Items
	 * @returns {string}
	 * @memberof MongoDB
	 */
	public static generateId256(...Items: any[]): string {
		let input = Items.join('#');
		return MongoCollection.hash256(input);
	}

	/**
	 * hash a string with sha256
	 * for example: password hashing
	 *
	 * @static
	 * @param {string} input
	 * @returns {string}
	 * @memberof MongoCollection
	 */
	public static hash256(input: string): string {
		const secret = Environment.getString(EnvVars.APP_SALT, 'd3f4ul75ecr3t');
		return createHmac('sha256', secret).update(input).digest('hex');
	}

	/**
	 *
	 *
	 * @protected
	 * @param {any} Items
	 * @returns {string}
	 * @memberof MongoDB
	 */
	protected idGenerator256(...Items: any[]): string {
		return MongoCollection.generateId256(...Items);
	}

	/**
	 *
	 *
	 * @readonly
	 * @type {string}
	 *
	 * @memberof MongoDB
	 */
	public get namespace(): string {
		return this.collection.namespace;
	}

	/**
	 *
	 *
	 * @param {(TC | TC[] | null)} data
	 * @returns {(TC | TC[] | null)}
	 * @memberof MongoCollection
	 */
	toObject(data: TC | TC[] | null): TC | TC[] | null {
		if (!data) {
			return null;
		}
		if (Array.isArray(data)) {
			return data.map((item) => plainToClass(this.getFactory(item), item));
		} else {
			return plainToClass(this.getFactory(data), data);
		}
	}

	/**
	 *
	 *
	 * @param {TC} data
	 * @returns {(new (item?: TC | undefined) => TC)}
	 * @memberof MongoCollection
	 */
	getFactory(data: TC): new (item?: TC | undefined) => TC {
		if (data.className) {
			return this.factories[data.className] || this.defaultFactory;
		} else {
			return this.defaultFactory;
		}
	}
}
