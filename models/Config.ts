export enum LOGTAG{
	INFO="[I]",
	ERROR="[E]",
	WARN="[W]",
	DEBUG="[D]"
};

export interface Config {
	log: {
		devel: boolean, 	// output development messages
		debug: boolean, 	// output debug messages
		warn: boolean,		// output warning messages
		info: boolean		// output info messages
	}
	app: {
		title: string,		// name of application master process
	},
	cli?: {
		commands: string[]	// list of commands allowed by cli
	}
};