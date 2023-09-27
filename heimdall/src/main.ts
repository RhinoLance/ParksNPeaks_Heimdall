/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { MainComponent } from "./app/pages/main/main.component";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TimeagoModule } from "ngx-timeago";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app-routing";
import { provideOAuthClient } from "angular-oauth2-oidc";
import { provideHttpClient } from "@angular/common/http";

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(MainComponent, {
	providers: [
		importProvidersFrom(BrowserModule, TimeagoModule.forRoot()),
		provideHttpClient(),
		provideOAuthClient(),
		provideAnimations(),
		provideRouter(routes),
	],
}).catch((err) => console.error(err)); // eslint-disable-line no-console
