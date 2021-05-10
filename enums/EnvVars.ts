export enum EnvVars {
	//  Database settings
	DB_NAME = 'MONGODB_DB',
	DB_CONNECT = 'MONGODB_URI',
	DB_APPNAME = 'MONGO_APPNAME',
	//  App settings
	APP_COOKIE_DOMAIN = 'COOKIE_DOMAIN',
	APP_SALT = 'SALT',
	APP_HOST = 'HOST',
	APP_PORT = 'PORT',
	APP_LOG_LEVEL = 'APP_LOG_LEVEL',
	APP_LOG_COLOR = 'APP_LOG_COLOR',
	APP_LOG_DB = 'APP_LOG_DB',
	APP_LOG_WS = 'APP_LOG_WS',
	//  email settings
	MAIL_SERVICE_TOKEN = 'SENDGRID',
	MAIL_FROM = 'MAIL_FROM',
	// openId settings
	OID_REALM = 'OID_REALM',
	OID_STEAM_REDIRECT = 'OID_STEAM_REDIRECT',
	OID_STEAM_KEY = 'OID_STEAM_KEY',
	OID_STEAM_RETURN = 'OID_STEAM_RETURN',

	// deprecated - move to database for translation
	MAIL_SUBJECT_VERIFICATION = 'MAIL_SUBJECT_VERIFICATION',
	MAIL_SUBJECT_WELCOME = 'MAIL_SUBJECT_WELCOME',
	MAIL_SUBJECT_BETA = 'MAIL_SUBJECT_BETA',
}
