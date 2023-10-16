import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class AppRouter {
	public constructor(private _router: Router) {}

	public navigate(route: RoutePath): void {
		this._router.navigate([`/${route}`]);
	}
}

export enum RoutePath {
	Root = "",
	Settings = "settings",
	Splash = "splash",
	SpotList = "spotList",

	CompoentnTester = "componentTester",
}
