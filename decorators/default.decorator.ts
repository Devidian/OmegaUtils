import { Transform } from 'class-transformer';

export function Default(defaultValue: unknown): PropertyDecorator {
	return Transform((value: unknown) => value ?? JSON.parse(JSON.stringify(defaultValue)));
}
