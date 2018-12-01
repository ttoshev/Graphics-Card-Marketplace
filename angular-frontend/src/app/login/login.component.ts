import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Login via Google
export class LoginComponent implements OnInit {

  /**
   * Inject authService for user authentication
   * @params: authService
   **/
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  /**
   * Call Firebase's function for Google Login
   **/
  loginGoogle(){
    this.authService.googleLogin();
  }
}
