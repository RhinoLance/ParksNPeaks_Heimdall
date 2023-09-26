/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { MainComponent } from "./app/components/main/main.component";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TimeagoModule } from "ngx-timeago";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app-routing";

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(MainComponent, {
	providers: [
		importProvidersFrom(BrowserModule, TimeagoModule.forRoot()),
		provideAnimations(),
		provideRouter(routes),
	],
}).catch((err) => console.error(err)); // eslint-disable-line no-console
