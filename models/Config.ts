export enum LOGTAG{
	INFO="[I]",
	ERROR="[E]",
	WARN="[W]",
	DEBUG="[D]"
};

export interface Config {
	log: {
		debug: boolean, 	// output debug messages
		warn: boolean,		// output warning messages
		info: boolean		// output info messages
	}
	master: {
		title: string,		// name of application master process
	},
	cli: {
		commands: string[]
	},
	worker: {
		title: string,		// Basename of app worker processes
	}
};