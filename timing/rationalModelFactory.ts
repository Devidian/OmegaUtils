import { clamp } from "../tools/clamp";

/**
 * Name: Rational Model
 * Type: Regression
 *
 *        a + bx
 * y = --------------
 *      1 + cx + dx²
 *
 * @export
 * @param {*} a
 * @param {*} b
 * @param {*} c
 * @param {*} d
 * @returns
 */
export function rationalModelFactory(a, b, c, d) {
    return (t) => {
        t = clamp(t, 0, 1);
        return (a+b*t)/(1+c*t+d*t*t);
    };
}