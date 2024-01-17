import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ConstructionSiteComponent } from './construction-site/construction-site.component';
import { ConstructionSiteDetailsComponent } from './construction-site-details/construction-site-details.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'login', component: LoginComponent},
  {path:'users', component: UserComponent},
  {path:'userdetails/:uid', component: UserDetailsComponent},
  {path:'constuctionSite', component: ConstructionSiteComponent},
  {path:'sitedetails/:cid', component: ConstructionSiteDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
