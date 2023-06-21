import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotListComponent } from './components/spot-list/spot-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PNPClient } from './services/PNPClient';

const routes: Routes = [
  { path: 'spotList', component: SpotListComponent },
  { path: '', redirectTo: '/spotList', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  
  constructor( pnpClient: PNPClient) { 

  }

  


}
