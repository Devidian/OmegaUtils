import { MongoClient } from 'mongodb';
import { BehaviorSubject } from 'rxjs';
import { EnvVars } from '../enums';
import { Environment } from './Environment';
import { Logger } from './Logger';

const options = {
	native_parser: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// ssl: false,
	appname: Environment.getString(EnvVars.DB_APPNAME) || 'NodeApp',
};

export const mongoClient = new BehaviorSubject<MongoClient>(null);

const logger = new Logger('mongoClient');

const connectionString = Environment.getString(EnvVars.DB_CONNECT, null);

if (!connectionString) {
	logger.error(`ENV:${EnvVars.DB_CONNECT} is not set process will terminate in 30 seconds`);
	setTimeout(() => {
		logger.info('ByeBye!!');
		process.exit();
	}, 30 * 1000);
} else {
	logger.verbose(`Connecting to MongoDB Server...`);

	MongoClient.connect(connectionString, options)
		.then((client) => {
			logger.debug(`MongoDB connection established`);
			mongoClient.next(client);
		})
		.catch((e) => logger.error(e));
}
