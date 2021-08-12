import { MongoClient, MongoClientOptions } from 'mongodb';
import { BehaviorSubject } from 'rxjs';
import { EnvVars } from '../enums';
import { Environment } from './Environment';
import { Logger } from './Logger';

const options:MongoClientOptions = {	
	// ssl: false,
	appName: Environment.getString(EnvVars.DB_APPNAME) || 'NodeApp',
};

export const mongoClient = new BehaviorSubject<MongoClient>(null);

const logger = new Logger('mongoClient');

const connectionString = Environment.getString(EnvVars.DB_CONNECT, null);

if (!connectionString) {
	void logger.error(`ENV:${EnvVars.DB_CONNECT} is not set process will terminate in 30 seconds`);
	setTimeout(() => {
		void logger.info('ByeBye!!');
		process.exit();
	}, 30 * 1000);
} else {
	void logger.verbose(`Connecting to MongoDB Server...`);

	MongoClient.connect(connectionString, options)
		.then((client) => {
			void logger.debug(`MongoDB connection established`);
			mongoClient.next(client);
		})
		.catch((e) => logger.error(e));
}
