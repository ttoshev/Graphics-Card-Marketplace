//TUTORIAL USED FOR AUTHENTICATION: https://www.dunebook.com/how-to-set-up-authentication-in-angular-5-with-firebase-firestore/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { QueryService } from './query.service';

import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // the current authentication state
  private authState: Observable<firebase.User>;
  // the currently logged in user
  public currentUser: firebase.User = null;
  // the list of all registered managerss
  managerList=[];
  // true if the current user is also a registered manager
  manager = false;
  
  /**
   * Inject afAuth for Firebase user authentication, router for navigation of anuglar pages
   * @params: afAuth
   * @params: router
   * @params: toastr
   * @params: queryService
   **/ 
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private tostr: ToastrService,
    private queryService: QueryService
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
        });
      }
      
  
    /**
     * Function returns true if the current user has verified their email
     **/ 
    isAuthenticated(): boolean {
      if(this.currentUser)
        return this.currentUser.emailVerified;
      else
        return false;
    }
    
    /**
     * Update the managerList array to hold the most recent list of managers
     **/ 
    getMngrs(){
      this.managerList=[];
      
      // getManagers function from our query service
      this.queryService.getManagers()
      .subscribe((data)=>{
        // push the newly returned list to our manager's list
        for(var x in data){
          this.managerList.push(data[x]);
        }
      })
    }
    
    
    /**
     * Returns true if the current user is a store manager
     **/
    isManager(): boolean {
      
      if (this.managerList.length<1)
        return false;
      
      // check authentication
      if(!this.isAuthenticated()){
        return false;
      }
      
      // check if current user is a manager
      for(var x in this.managerList){
        if (this.managerList[x].userEmail==this.currentUser.email){ // is indeed a store manager
          return true;
        }
      }
      return false; // not found in list of managers
    }
   
   
    /**
     * Function sends a verification email to the current user
     **/ 
    sendVerificationEmail(){
      this.currentUser.sendEmailVerification()
      
      .then(function()  {

      })
      
      .catch(function(error) {

      });
    }
    
    
    /**
     * Used for signing in with Google
     **/ 
    private oAuthLogin(provider) {
      return this.afAuth.auth.signInWithPopup(provider);
    }
  
  
    /**
     * Log out of the current user, show them the homepage, unauthenticated
     **/
    logout() {
      this.tostr.success('Logging out...', 'Success!')
      this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/home']);
      });
    }
    
    
  /**
   * "Back end" calls - Firebase's Authentication service allows for login operation without the need for a back end api
   * Source: https://www.dunebook.com/how-to-set-up-authentication-in-angular-5-with-firebase-firestore/
   * User for google login call, email/password login call, signup (email/password)
   **/
  login(email: string, password: string) {
    
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(message => {
      console.log("auth.service.ts.login --> Has the user been verified? "+this.currentUser.emailVerified);
      
      // verified user login
      if (this.isAuthenticated()){
        this.tostr.success('Logging in...', 'Success!')
        this.router.navigateByUrl('/profile');
      }
      
      // unverified user attempted login
      else{
        if(this.currentUser){
          this.sendVerificationEmail();
          this.tostr.warning('Email not verified! Sending verification', 'Oops...');
        }
      }
    })
    .catch(err => {
        this.tostr.warning(err.message, 'Oops...');
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
      alert(error);
      console.log('Something went wrong: ', error);
    });
    
  }
  
  
  emailSignup(email: string, password: string) {
    
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(message => {
      console.log('Success', message);
      
      this.login(email,password);
      this.login(email,password);
      
      //this.sendVerificationEmail();
      this.queryService.postUser(email.toLowerCase()); // add the user to our mlab database

      this.router.navigateByUrl('/login');
    })
    
    .catch(error => {
      this.tostr.warning(error.message, 'Oops...');
      //alert(error);
      console.log('Something went wrong: ', error);
    });
    
  }
  
}
