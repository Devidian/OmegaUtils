import { clamp } from "../tools/clamp";

/**
 *
 * Formula: q0(1+bx/a)^^(-1/b)
 *
 * @export
 * @param {*} q0
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function hyperbolicDeclineFactory(q0, a, b) {

    const exp = -1 / b;

    return (t) => {
        t = clamp(t, 0, 1);
        return q0 * Math.pow((1 + b * t / a), exp);
    };
}