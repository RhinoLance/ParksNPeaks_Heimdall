import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { SpotListComponent } from "./components/spot-list/spot-list.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { MainComponent } from "./components/main/main.component";
import { SpotHistoryCardComponent } from "./components/spot-history-card/spot-history-card.component";
import { ActivationComponent } from "./components/activation/activation.component";
import { ModeBadgeComponent } from "./mode-badge/mode-badge.component";

@NgModule({
	declarations: [
		SpotListComponent,
		PageNotFoundComponent,
		MainComponent,
		SpotHistoryCardComponent,
		ActivationComponent,
		ModeBadgeComponent,
	],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [MainComponent],
})
export class AppModule {}
