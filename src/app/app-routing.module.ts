import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';
import { ConfigComponent } from './config/config.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ScansComponent } from './scans/scans.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'config', component: ConfigComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
      { path: 'scans', component: ScansComponent },
      { path: '', component: HomeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
