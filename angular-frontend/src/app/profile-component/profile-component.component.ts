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
  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()){
      console.log(this.authService.isAuthenticated());
      this.username = this.authService.currentUser.email;
      console.log(this.authService.currentUser.email)
    }
    else
    {
      console.log(this.authService.isAuthenticated());
      this.router.navigate(['/']);
    }
      //this.username = authService.currentUser.username
  }

  ngOnInit() {
  }
  
  loginRedirect(){
    this.router.navigate(['/login']);
  }
  
  showAboutUs(){
    return;
  }
  
  signOut() {
    this.authService.logout();
  }
  
}
