/**
 * convert SteamID to SteamID64
 *
 * @see https://developer.valvesoftware.com/wiki/SteamID
 * @param {string} steamID
 * @returns
 */
export function steamIDtoSteamID64(steamID: string): bigint {
	const rx = /STEAM_([0-9]+):([0-9]+):([0-9]+)/;
	const match = rx.exec(steamID);
	if (match) {
		const [, universe, lowestBit, highest31Bits] = match.map(Number);

		const B = Buffer.alloc(8); // 64Bit Buffer

		B.writeIntBE(universe, 0, 1);
		B.writeIntBE(1, 1, 3);
		B.writeIntBE(1 << 4, 1, 1);
		B.writeIntBE((highest31Bits << 1) | lowestBit, 4, 4);

		return B.readBigInt64BE();
	} else {
		throw 'NOT A VALID STEAMID';
	}
}
