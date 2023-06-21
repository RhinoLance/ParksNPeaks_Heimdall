import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { SpotListComponent } from './components/spot-list/spot-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainComponent } from './components/main/main.component';

@NgModule({
	declarations: [SpotListComponent, PageNotFoundComponent, MainComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [MainComponent],
})
export class AppModule {}
