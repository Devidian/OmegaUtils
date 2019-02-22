import { clamp } from "../tools/clamp";

export function sigmoidFactory (k) {
	let base = (t)=>{
		return (1 / (1 + Math.exp(-k * t))) - 0.5;
	}

	var correction = 0.5 / base(1);

	return (t)=>{
		t = clamp(t, 0, 1);
		return correction * base(2 * t - 1) + 0.5;
	};
}