import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SpotListComponent } from "./pages/spot-list/spot-list.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { SplashComponent } from "./pages/splash/splash.component";

const routes: Routes = [
	{ path: "splash", component: SplashComponent },
	{ path: "spotList", component: SpotListComponent },
	{ path: "", redirectTo: "/spotList", pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

export enum RoutePaths {
	Splash = "/splash",
	SpotList = "/spotList",
}
