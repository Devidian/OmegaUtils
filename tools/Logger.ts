import { cfg } from "../../config";
import { LOGTAG } from "../models/Config";

export function Logger(level: number, source: string, ...messages: any[]): void {
    if (level < cfg.log.level) {
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
        levelTag = LOGTAG.DEV
    }
    console.log(levelTag, `[${source}]`, ...messages);
}