import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css']
})

export class ProfileComponent implements OnInit {
  username;
  cartShown = false;
  
  /**
   * Inject authService for user authentication and router to navigate angular pages
   * @params: authService
   * @params: router
   **/
  constructor(public authService: AuthService, private router: Router) {
  
    // if the user is successfully authenticated, set the username to be displayed
    console.log('Authenticated? '+this.authService.isAuthenticated())
    console.log(this.authService.currentUser);
    if (this.authService.isAuthenticated()){
      this.username = this.authService.currentUser.email;
    }
    else{
      this.router.navigate(['/home']);
    }
    
    // update the current manager list
    this.authService.getMngrs();
    
  }

  ngOnInit() {}
  
  /**
   * Redirect the user to the login page
   **/
  loginRedirect(){
    this.router.navigate(['/login']);
  }
  

  /**
   * Log out from the current user
   **/
  signOut() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  
  /**
   * Switch between showing cart and about message
   **/
  showCart(){
    this.cartShown=true;
  }
  
  hideCart(){
    this.cartShown=false;
  }
  
}
