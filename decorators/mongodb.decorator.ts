import { mongoClient } from '../tools/mongoClient';

export function MongoDB(target: Object, propertyKey: string): void {
	Object.defineProperty(target, propertyKey, {
		get: () => mongoClient,
	});
}
