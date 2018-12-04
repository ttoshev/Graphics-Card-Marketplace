import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage-component',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  username;
  
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
  }
  
  
}
