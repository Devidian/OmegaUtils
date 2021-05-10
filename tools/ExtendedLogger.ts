import { DatabaseCollection } from '../decorators/database-collection.decorator';
import { Logger } from './Logger';
import { DBLogEntity } from '../entities/db-log.entity';
import { MongoCollection } from './MongoCollection';
import { EntityFactory } from '../factories/entity.factory';
import { Environment } from './Environment';
import { first } from 'rxjs/operators';
import { EnvVars } from '../enums';

export class ExtendedLogger extends Logger {
	@DatabaseCollection<DBLogEntity>('logger', DBLogEntity)
	static collectionRef: MongoCollection<DBLogEntity>;

	private get logToDatabase(): boolean {
		return Environment.getBoolean(EnvVars.APP_LOG_DB);
	}

	private get logToWebSockets(): boolean {
		return Environment.getBoolean(EnvVars.APP_LOG_WS);
	}

	public async log(level: number, ...messages: any[]): Promise<void> {
		super.log(level, ...messages);
		this.logDatabase(level, messages);
		this.logWebSockets(level, messages);
	}

	private async logDatabase(level: number, messages: any[]): Promise<void> {
		if (!this.logToDatabase) {
			return;
		}

		const logEntity: DBLogEntity = EntityFactory.create(DBLogEntity, {
			context: this.context,
			loglevel: level,
			messages,
		});

        await ExtendedLogger.collectionRef.$isReady.pipe(first((f) => !!f)).toPromise();
        ExtendedLogger.collectionRef.save(logEntity);
	}

	private async logWebSockets(level: number, messages: any[]): Promise<void> {
		if (!this.logToWebSockets) {
			return;
		}
	}
}
