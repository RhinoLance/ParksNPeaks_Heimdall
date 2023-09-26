import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class AppRouter {
	constructor(private _router: Router) {}

	public navigate(route: RoutePath): void {
		this._router.navigate([`/${route}`]);
	}
}

export enum RoutePath {
	Root = "",
	Splash = "splash",
	SpotList = "spotList",
}
