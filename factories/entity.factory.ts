import { plainToClassFromExist } from 'class-transformer';

export class EntityFactory {
	public static create<T>(cls: ClassType<T>, data?: DeepPartial<T>): T {
		const instance = new cls();
		return plainToClassFromExist(instance, data || {}, { groups: ['owner'] });
	}
}
