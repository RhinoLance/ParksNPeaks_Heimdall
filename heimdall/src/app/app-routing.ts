import { Route } from "@angular/router";
import { SpotListComponent } from "./pages/spot-list/spot-list.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { SplashComponent } from "./pages/splash/splash.component";
import { RoutePath } from "./services/AppRountingService";
import { SettingsComponent } from "./pages/settings/settings.component";
import { ComponentTesterComponent } from "./pages/component-tester/component-tester.component";
import { AnalyticsComponent } from "./pages/analytics/analytics.component";

export const routes: Route[] = [
	{ path: RoutePath.Settings, component: SettingsComponent },
	{ path: RoutePath.Splash, component: SplashComponent },
	{ path: RoutePath.SpotList, component: SpotListComponent },
	{ path: RoutePath.Analytics, component: AnalyticsComponent },
	{ path: RoutePath.CompoentnTester, component: ComponentTesterComponent },

	{ path: RoutePath.Root, redirectTo: RoutePath.SpotList, pathMatch: "full" },

	{ path: "**", component: PageNotFoundComponent },
];
