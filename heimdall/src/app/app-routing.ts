import { Route } from "@angular/router";
import { SpotListComponent } from "./pages/spot-list/spot-list.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { SplashComponent } from "./pages/splash/splash.component";
import { RoutePath } from "./services/AppRountingService";

export const routes: Route[] = [
	{ path: RoutePath.Splash, component: SplashComponent },
	{ path: RoutePath.SpotList, component: SpotListComponent },
	{ path: RoutePath.Root, redirectTo: RoutePath.SpotList, pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent },
];
