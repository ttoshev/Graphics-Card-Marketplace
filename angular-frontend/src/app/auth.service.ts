import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: Observable<firebase.User>;
  public currentUser: firebase.User = null;


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
    ){
      // get the authentication state
      this.authState = this.afAuth.authState;
      
      this.afAuth.authState.subscribe(user => {
        // there is a user logged in
        if (user) {
          this.currentUser = user;
          //this.openSnackBar('Successfully authenticated');
          console.log('AUTHSTATE USER', user);
          
          // no user is logged in
        } else {
          console.log('AUTHSTATE USER EMPTY', user)
          this.currentUser = null;
        }
      },
        err => {
          //this.openSnackBar(`${err.status} ${err.statusText} (${err.error.message})`, 'Please try again')
        });
      }
  
    /**
     * Function Returns true if the current user has verified their email
     **/ 
    isAuthenticated(): boolean {
      if(this.currentUser)
        return this.currentUser.emailVerified;
      else
        return false;
    }
   
    /**
     * Function sends a verification email to the current user
     **/ 
    sendVerificationEmail(){
      this.currentUser.sendEmailVerification()
      
      // Email sent.
      .then(function()  {
        alert('Email sent. Please verify it before logging in.');
      })
      
      // An error happened
      .catch(function(error) {
        console.log(error);
      });
    }
    
    /**
     * Used for signing in with google
     **/ 
    private oAuthLogin(provider) {
      return this.afAuth.auth.signInWithPopup(provider);
    }
  
    logout() {
      this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
      });
    }
  
  /**
   * 
   * "Back end" calls - Firebase's Authentication service allows for login operation without the need for a back end api
   * Source: https://www.dunebook.com/how-to-set-up-authentication-in-angular-5-with-firebase-firestore/
   * User for google login call, email/password login call, signup (email/password)
   * 
   **/
  login(email: string, password: string) {
    
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(message => {
      console.log("auth.service.ts.login --> Has the user been varified? "+this.currentUser.emailVerified);

      // verified user login
      if (this.isAuthenticated())
        this.router.navigateByUrl('/profile');
      // unverified user attempted login
      else{
        console.log('Re-sending verification e-mail...')
        this.sendVerificationEmail();
        alert('E-mail not verified! Resent verification, please check your email.');
      }
    })
    
    .catch(err => {
      console.log('Something went wrong: ', err.message);
    });
    
  }
  
  googleLogin() {
    
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
    .then(message => {
      console.log('Sucess', message),
      this.router.navigateByUrl('/profile');
    })
    
    .catch(error => {
      console.log('Something went wrong: ', error);
    });
    
  }
  
  emailSignup(email: string, password: string) {
    
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(message => {
      console.log('Sucess', message);
      this.sendVerificationEmail();
      this.router.navigateByUrl('/login');
    })
    
    .catch(error => {
      alert(error);
      console.log('Something went wrong: ', error);
    });
    
  }
  
}
