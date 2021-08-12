import { Transform } from 'class-transformer';

export function Default(defaultValue: unknown): PropertyDecorator {
	return Transform(({ value }) => value ?? JSON.parse(JSON.stringify(defaultValue)));
}
