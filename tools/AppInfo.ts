import { resolve } from "path";
import { existsSync } from "fs";

export class AppInfo {

    public static async version(): Promise<string> {
        const packageFilePath = resolve(process.cwd(), "package.json");
        if(existsSync(packageFilePath)){
            const packageInfo = await import(packageFilePath);

            return packageInfo.version;
        } else {
            return "N/A";
        }
    }
}