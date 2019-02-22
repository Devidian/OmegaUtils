import { clamp } from "../tools/clamp";

export function drMultistage4Factory(gamma, beta1, beta2, beta3, beta4) {

    let r0 = 1 - gamma;

    return (t) => {
        t = clamp(t, 0, 1);
        let r1 = beta1 * t;
        let r2 = beta2 * t ^ 2;
        let r3 = beta3 * t ^ 3;
        let r4 = beta4 * t ^ 4;
        let r5 = 1 - Math.exp(-r1 - r2 - r3 - r4);
        let r7 = Math.pow(r0, r5);
        console.log(t, r1, r2, r3, r4, r5, r0, r7);
        return gamma + r7;
    }
}
