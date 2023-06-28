import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SpotListComponent } from "./components/spot-list/spot-list.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { SpotHistoryCardComponent } from "./components/spot-history-card/spot-history-card.component";

const routes: Routes = [
	{ path: "spotList", component: SpotListComponent },
	{ path: "spotHistory", component: SpotHistoryCardComponent },
	{ path: "", redirectTo: "/spotList", pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
