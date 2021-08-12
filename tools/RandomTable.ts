import { Logger } from "./Logger";

/**
 * creates some pseudo random numbers to sync with different processes that perform the same operations
 * (random text animations for example)
 *
 * @export
 * @class RandomTable
 */
export class RandomTable {
    protected static randomMap: Map<string, number[]> = new Map<string, number[]>();

    protected static logger: Logger = new Logger(RandomTable.name);

    /**
     *
     *
     * @static
     * @param {number} [length=128]
     * @param {string} [index="default"]
     * @returns {number[]}
     * @memberof RandomTable
     */
    public static generate(length = 128, index = "default"): number[] {
        const table = (new Array(length)).fill(0).map((v) => Math.random());
        RandomTable.randomMap.set(index, table);
        return table;
    }

    /**
     *
     *
     * @static
     * @param {number} [length=128]
     * @param {string} [index="default"]
     * @returns {Buffer}
     * @memberof RandomTable
     */
    public static generateBuffer(length = 128, index = "default"): Buffer {
        const table = RandomTable.generate(length, index);
        const b = Buffer.alloc(length * 8);
        table.forEach((n, i) => {
            b.writeDoubleBE(n, i * 8);
        });
        return b;
    }

    /**
     *
     *
     * @static
     * @param {string} index
     * @returns {number[]}
     * @memberof RandomTable
     */
    public static getTable(index: string): number[] {
        return RandomTable.randomMap.get(index);
    }

    /**
     *
     *
     * @static
     * @param {string} index
     * @returns {Buffer}
     * @memberof RandomTable
     */
    public static getBuffer(index: string): Buffer {
        const table = RandomTable.getTable(index);
        const b = Buffer.alloc(table.length * 8);
        table.forEach((n, i) => {
            b.writeDoubleBE(n, i * 8);
        });
        return b;
    }

    /**
     *
     *
     * @static
     * @param {string} index
     * @param {number} number
     * @returns {number}
     * @memberof RandomTable
     */
    public static random(index: string, number: number): number {
        try {
            const t = RandomTable.getTable(index);
            const v = number % t.length; // if table is 128 long and we want number 130 we startover
            return t[v];
        } catch (error) {
            void RandomTable.logger.warn(`no table with index ${index} returning Math.random() instead!`);
            return Math.random();
        }
    }

    /**
     *
     *
     * @static
     * @param {string} index
     * @param {Buffer} buf
     * @memberof RandomTable
     */
    public static setFromBuffer(index: string, buf: Buffer): void {
        const t = [];
        for (let offset = 0; offset < buf.byteLength; offset += 8) {
            t.push(buf.readDoubleBE(offset));
        }
        RandomTable.randomMap.set(index, t);
    }
}