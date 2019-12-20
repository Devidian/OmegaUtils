export interface Config {
	log: {
		level: number			// logging level
	}
	app: {
		title: string,			// name of application master process
		service: {
			user: string,	// service user
			id: string,		// service id for rsyslog
			name: string,	// service (file) name
			desc?: string,	// service unit description
			env: string[],	// additional environment settings
			after: string[],// start after this services (network.target for example)
		}
	}
};
