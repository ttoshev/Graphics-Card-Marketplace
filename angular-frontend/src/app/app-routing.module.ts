import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from './email-component/email-component.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile-component/profile-component.component';
import { SignupComponent } from './signup/signup.component'
import { HomepageComponent } from './homepage/homepage.component'
import { ManageUsersComponent } from './manage-users/manage-users.component'


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'email-login', component: EmailComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'manageUsers', component: ManageUsersComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
