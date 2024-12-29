export type ObjectEntry<T> = {
	// Without Exclude<keyof T, undefined>, this type produces `ExpectedEntries | undefined`
	// if T has any optional keys.
	[K in Exclude<keyof T, undefined>]: [K, T[K]];
}[Exclude<keyof T, undefined>];

export const objectEntries = Object.entries as <T>(
	o: T,
) => Array<ObjectEntry<T>>;
