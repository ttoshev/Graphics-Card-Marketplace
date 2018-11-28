import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email-component.component.html',
  styleUrls: ['./email-component.component.css']
})
export class EmailComponent implements OnInit {
  
  /**
   * Inject authService for user authentication
   * @params: authService
   **/ 
  constructor(private authService: AuthService) { }

  ngOnInit() {}
  
  /**
   * Login via email, calls authService login with user inputted email and password
   * @params: formData
   **/
  onSubmit(formData) {
    
    // check if the form has been filled out correctly
    if (formData.valid) {
      this.authService.login(formData.value.email,formData.value.password);
    }
    
  }

}
