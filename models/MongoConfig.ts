import { Config } from "./Config";
import { ConfigDB, MongoConfig } from "../mongo"

export interface MongoDBConfig extends Config {
	db: ConfigDB,
	mongo: MongoConfig
};