import { Config } from "./Config";
import { ConfigDB, MongoConfig } from "../mongo/models/MongoConfig"

export interface MongoDBConfig extends Config {
	db: ConfigDB,
	mongo: MongoConfig
};