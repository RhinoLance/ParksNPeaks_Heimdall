import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class StorageService {
	public save(key: string, value: object): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	public load<T>(key: string): T | undefined {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value) as T;
		}
		return undefined;
	}
}
