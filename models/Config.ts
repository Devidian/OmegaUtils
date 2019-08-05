export enum LOGTAG {
	INFO = "[I]",
	ERROR = "[E]",
	WARN = "[W]",
	DEBUG = "[D]",
	DEV = "[V]"
};

export interface Config {
	log: {
		level: number		// logging level
	}
	app: {
		title: string,		// name of application master process
	}
};