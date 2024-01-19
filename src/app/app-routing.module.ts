import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ConstructionSiteComponent } from './construction-site/construction-site.component';
import { ConstructionSiteDetailsComponent } from './construction-site-details/construction-site-details.component';
import { AccountComponent } from './account/account.component';
import { ConstructionSiteOverviewComponent } from './construction-site-overview/construction-site-overview.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'login', component: LoginComponent},
  {path:'users', component: UserComponent},
  {path:'user-details/:uid', component: UserDetailsComponent},
  {path:'construction-site', component: ConstructionSiteComponent},
  {path:'construction-site-overview', component: ConstructionSiteOverviewComponent},
  {path:'site-details/:cid', component: ConstructionSiteDetailsComponent},
  // TODO: add id as parameter
  {path:'account', component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
