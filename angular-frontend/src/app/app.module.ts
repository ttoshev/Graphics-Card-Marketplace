import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email-component/email-component.component';
import { ProfileComponent } from './profile-component/profile-component.component';
import { ItemsComponent } from './items/items.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CartComponent } from './cart/cart.component';
import { AboutComponent } from './about/about.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { PoliciyComponent } from './policiy/policiy.component';
import { ComplaintsComponent } from './complaints/complaints.component';

const firebaseConfig = {
  apiKey: "AIzaSyBrb05-WjyJQxTDkZbFQzB1p2nVXMyIAI8",
  authDomain: "my-store-9c70c.firebaseapp.com",
  databaseURL: "https://my-store-9c70c.firebaseio.com",
  projectId: "my-store-9c70c",
  storageBucket: "my-store-9c70c.appspot.com",
  messagingSenderId: "55889740143"
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    SignupComponent,
    EmailComponent,
    ProfileComponent,
    ItemsComponent,
    CartComponent,
    AboutComponent,
    ManageUsersComponent,
    PoliciyComponent,
    ComplaintsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    HttpModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthService, CartComponent],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
