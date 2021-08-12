import { DatabaseCollection } from '../decorators/database-collection.decorator';
import { Logger } from './Logger';
import { DBLogEntity } from '../entities/db-log.entity';
import { MongoCollection } from './MongoCollection';
import { EntityFactory } from '../factories/entity.factory';
import { Environment } from './Environment';
import { first } from 'rxjs/operators';
import { UtilEnvVars } from '../enums';
import { firstValueFrom } from 'rxjs';

export class ExtendedLogger extends Logger {
	@DatabaseCollection<DBLogEntity>('logger', DBLogEntity)
	static collectionRef: MongoCollection<DBLogEntity>;

	private get logToDatabase(): boolean {
		return Environment.getBoolean(UtilEnvVars.APP_LOG_DB);
	}

	private get logToWebSockets(): boolean {
		return Environment.getBoolean(UtilEnvVars.APP_LOG_WS);
	}

	public async log(level: number, ...messages: any[]): Promise<void> {
		void super.log(level, ...messages);
		void this.logDatabase(level, messages);
		void this.logWebSockets(level, messages);
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

		await firstValueFrom(ExtendedLogger.collectionRef.$isReady.pipe(first((f) => !!f)));
		ExtendedLogger.collectionRef.save(logEntity).catch((e) => {
			void super.error(e);
		});
	}

	private async logWebSockets(level: number, messages: any[]): Promise<void> {
		if (!this.logToWebSockets) {
			return;
		}
	}
}
