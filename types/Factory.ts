type Factory<T> = new (item?: T) => T;
type FactoryList<T> = Record<string, Factory<T>>;
