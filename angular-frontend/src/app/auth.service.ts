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

  constructor(
    
    private afAuth: AngularFireAuth,
    private router: Router
    
    ){}
  
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
      console.log('Nice, it worked!');
      this.router.navigateByUrl('/profile');
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
      this.router.navigateByUrl('/profile');
    })
    
    .catch(error => {
      console.log('Something went wrong: ', error);
    });
    
  }
  
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
