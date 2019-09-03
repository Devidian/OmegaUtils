import { LOGTAG, Config } from "../models/Config";
import { resolve } from "path";

export async function Logger(level: number, source: string, ...messages: any[]): Promise<void> {
    const config = await import(resolve(process.cwd(), 'bin', 'config'));
    const cfg: Config = config.cfg;
    const currentLevel = cfg && cfg.log && cfg.log.level ? cfg.log.level : 0;
    if (level < currentLevel) {
        return;
    }
    let levelTag = LOGTAG.DEBUG;
    if (level >= 900) {
        levelTag = LOGTAG.ERROR;
    } else if (level >= 500) {
        levelTag = LOGTAG.WARN;
    } else if (level >= 100) {
        levelTag = LOGTAG.INFO;
    } else if (level < 11) {
        levelTag = LOGTAG.DEV;
    }
    console.log(levelTag, `[${source}]`, ...messages);
}