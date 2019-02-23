'use strict';
import { Db, MongoClient, MongoError } from 'mongodb';

import { LOGTAG } from '../models/Config';
import { ConfigLoader } from '../tools/ConfigLoader';
import { MongoDBConfig } from '../models/MongoConfig';

/**
 *
 *
 * @export
 * @abstract
 * @class MongoApp
 */
export abstract class MongoApp {
	protected MongoClient: MongoClient = null;
	protected MongoDatabase: Db = null;
	protected MongoFailState: string = null;

	protected isMaster: boolean = !process.connected;
	protected _isReady: boolean = false;

	private get cfg(): MongoDBConfig {
		const CL = ConfigLoader.getInstance<MongoDBConfig>();
		return CL ? CL.cfg : null;
	}

	/**
	 *
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof MongoApp
	 */
	public get isReady(): boolean {
		return this._isReady;
	}

	/**
	 * Creates an instance of MongoApp.
	 * @memberof MongoApp
	 */
	constructor() {
		this.mongoConnect();
	}

	/**
	 *
	 *
	 * @protected
	 * @memberof MongoApp
	 */
	protected mongoAfterConnect(): void {
		this._isReady = true;
		!this.cfg.log.info ? null : console.log(LOGTAG.INFO, '[BOOT]', `${this.isMaster ? 'Master' : `Worker`} MongoDB connected! PID: ${process.pid}`);
	}

	/**
	 * Stuff to do when mongo connection was destroyed due to closed socket
	 *
	 * @protected
	 * @memberof MongoApp
	 */
	protected mongoOnSocketClose(): void {
		setTimeout(() => this.mongoConnect(), 250);
	}

	/**
	 *
	 *
	 * @protected
	 * @memberof MongoApp
	 */
	protected mongoConnect(): void {
		MongoClient.connect(this.cfg.mongo.url, this.cfg.mongo.options).then((MC: MongoClient) => {
			try {
				this.MongoFailState = null;
				this.MongoClient = MC;
				this.MongoDatabase = MC.db(this.cfg.mongo.db);

				// Socket timeout means the driver tries to reconnect x times before closeing the socket
				MC.on('timeout', () => { // connectTimeoutMS seems to trigger this after lost connection
					this.MongoFailState = "MongoCollection socket timeout!";
					console.log(LOGTAG.ERROR, "A MongoCollection socket timeout occurred!");
				});

				// After close we need to reconnect manually
				MC.on('close', () => {
					this.MongoFailState = "MongoCollection socket closed!";
					console.log(LOGTAG.ERROR, "A MongoCollection socket closed!");
					this.mongoOnSocketClose();
				});

				MC.on('error', (err: MongoError) => {
					this.MongoFailState = err.message;
					console.log(LOGTAG.ERROR, err.message);
				});

				MC.on('reconnect', () => {
					this.MongoFailState = null;
					console.log("MongoCollection connection restored!");
				});

				this.mongoAfterConnect();
			} catch (error) {
				this.MongoFailState = "Failed to setup MongoCollection collections";
				console.log(LOGTAG.ERROR, error);
				process.exit(3001);
			}
		}).catch(e => {
			this.MongoFailState = "Failed to connect to MongoCollection";
			console.log(LOGTAG.ERROR, this.MongoFailState);
			setTimeout(() => this.mongoConnect(), 1000);
		});
	}
}