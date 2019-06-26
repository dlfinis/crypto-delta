import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinDataComponent } from './coin-data/coin-data.component';
import { CoinConversionComponent } from './coin-conversion/coin-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: CoinListComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'list',
    component: CoinListComponent
  },
  {
    path: 'list/:coin',
    component: CoinDataComponent
  },
  {
    path: 'conversion/:coin',
    component: CoinConversionComponent
  }
  // {
  //   path: 'list',
  //   component: CoinListComponent,
  //   children: [
  //     {
  //     path: ':coin',
  //     component: CoinDataComponent,
  //     }
  //   ]
  // },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
