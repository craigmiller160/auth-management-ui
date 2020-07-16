export class Option<T> {
    private constructor(private value: T | null) { }

    static some<T>(value: T): Option<T> {
        if (!value) {
            throw new Error('Some value must not be null/undefined');
        }
        return new Option(value);
    }

    static none<T>(): Option<T> {
        return new Option<T>(null);
    }

    static fromValue<T>(value: T): Option<T> {
        return value ? Option.some(value) : Option.none();
    }

    isPresent(): boolean {
        return this.value !== null;
    }

    getOrElse(defaultValue: T): T {
        return this.value === null ? defaultValue : this.value;
    }
}
