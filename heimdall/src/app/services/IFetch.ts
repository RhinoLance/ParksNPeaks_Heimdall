export interface IFetch {
	getJson<T>(suffix: string, request: RequestInit): Promise<T>;
}
