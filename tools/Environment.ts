export class Environment {
	static getBoolean(envName: string, defaultValue = 'false'): boolean {
		return ['1', 'true', 'yes', 'y'].includes(Environment.getPlainLowercae(envName || defaultValue));
	}

	static getNumber(envName: string, defaultValue = 0): number {
		return Number(process.env[envName] || defaultValue);
	}

	static getString(envName: string, defaultValue = ''): string {
		return process.env[envName] || defaultValue;
	}

	static getArray(envName: string, seperator = ',', defaultValue: string[] = []): string[] {
		return process.env[envName]?.split(seperator) || defaultValue;
	}

	static getPlainLowercae(envName: string, defaultValue = ''): string {
		return (process.env[envName] || defaultValue).toLowerCase();
	}
}
