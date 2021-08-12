import { ConsoleColors, UtilEnvVars, Loglevel, LOGTAG } from '../enums';
import { Environment } from './Environment';

export class Logger {
	protected get useColor(): boolean {
		return Environment.getBoolean(UtilEnvVars.APP_LOG_COLOR);
	}

	protected get currentLevel(): number {
		return Environment.getNumber(UtilEnvVars.APP_LOG_LEVEL, 0);
	}

	protected get logToConsole(): boolean {
		return true;
	}

	constructor(protected context?: string) {}

	public async verbose(...messages: any[]): Promise<void> {
		return this.log(Loglevel.VERBOSE, ...messages);
	}

	public async debug(...messages: any[]): Promise<void> {
		return this.log(Loglevel.DEBUG, ...messages);
	}

	public async info(...messages: any[]): Promise<void> {
		return this.log(Loglevel.INFO, ...messages);
	}

	public async warn(...messages: any[]): Promise<void> {
		return this.log(Loglevel.WARNING, ...messages);
	}

	public async error(...messages: any[]): Promise<void> {
		return this.log(Loglevel.ERROR, ...messages);
	}

	public async exception(...messages: any[]): Promise<void> {
		return this.log(Loglevel.ERROR, ...messages);
	}

	public async log(level: number, ...messages: any[]): Promise<void> {
		void this.logConsole(level, messages);
	}

	protected async logConsole(level: number, messages: any[]): Promise<void> {
		if (level < this.currentLevel || !this.logToConsole) {
			return;
		}
		let color = ConsoleColors.FG_BLUE;
		let levelTag = LOGTAG.DEBUG;
		if (level >= 900) {
			levelTag = LOGTAG.ERROR;
			color = ConsoleColors.FG_RED;
		} else if (level >= 500) {
			levelTag = LOGTAG.WARN;
			color = ConsoleColors.FG_YELLOW;
		} else if (level >= 100) {
			levelTag = LOGTAG.INFO;
			color = ConsoleColors.FG_WHITE;
		} else if (level < 11) {
			levelTag = LOGTAG.DEV;
			color = ConsoleColors.FG_MAGENTA;
		}

		const processTitle = process.title && !process.title.includes('node') ? `[${process.title}]` : '[NodeApp]';

		if (this.useColor) {
			console.log(
				color + levelTag + ConsoleColors.RESET,
				processTitle,
				this.context ? ConsoleColors.FG_CYAN + `[${this.context}]` + ConsoleColors.RESET : '',
				...messages,
			);
		} else {
			console.log(levelTag, processTitle, this.context ? `[${this.context}]` : '', ...messages);
		}
	}
}
