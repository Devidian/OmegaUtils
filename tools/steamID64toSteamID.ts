/**
 * convert steamID64 to SteamID
 *
 * @see https://developer.valvesoftware.com/wiki/SteamID
 * @param {bigint} steamID64 64 Bit representation
 * @returns
 */
export function steamID64toSteamID(steamID64: bigint): string {
	const B = Buffer.alloc(8);
	B.writeBigInt64BE(steamID64);
	const universe = B.readIntBE(0, 1);
	// const type = B.readIntBE(1, 1) >> 4;
	// const instance = B.readIntBE(2, 2); // this is not exactly correct but should fit in all cases currently
	const b32 = B.readInt32BE(4);
	const highest31Bits = b32 >> 1;
	const lowestBit = b32 & 0x01;
	return `STEAM_${universe}:${lowestBit}:${highest31Bits}`;
}
