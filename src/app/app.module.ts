import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailsComponent } from './user-details/user-details.component';

import { MatDialogModule } from '@angular/material/dialog';
import { UserAddComponent } from './user-add/user-add.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConstructionSiteComponent } from './construction-site/construction-site.component';
import { ConstructionSiteDetailsComponent } from './construction-site-details/construction-site-details.component';
import { MatCardModule } from '@angular/material/card';
import { ConstructionSiteAddComponent } from './construction-site-add/construction-site-add.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AccountComponent } from './account/account.component';
import { ConstructionSiteOverviewComponent } from './construction-site-overview/construction-site-overview.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeleteUserComponent } from './delete-user/delete-user.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    UserDetailsComponent,
    UserAddComponent,
    ConstructionSiteComponent,
    ConstructionSiteDetailsComponent,
    ConstructionSiteAddComponent,
    MenuBarComponent,
    AccountComponent,
    ConstructionSiteOverviewComponent,
    DeleteUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
