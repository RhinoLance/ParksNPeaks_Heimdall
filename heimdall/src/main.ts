import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { MainComponent } from "./app/components/main/main.component";
import { AppRoutingModule } from "./app/app-routing.module";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(MainComponent, {
	providers: [importProvidersFrom(BrowserModule, AppRoutingModule)],
}).catch((err) => console.error(err)); // eslint-disable-line no-console
