import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthService, private tostr: ToastrService) { }

  ngOnInit() {
  }

  onSubmit(formData) {
    if (!formData.value.email){
      this.tostr.warning("Please provide an email", 'Oops...');
      return;
    }
    
    else if(!formData.value.password){
      this.tostr.warning("Please enter a password", 'Oops...');
      return;
    }
    
    if (formData.valid) {
      console.log(formData.value);
      this.authService.emailSignup(
        formData.value.email,
        formData.value.password
      );
    }
  }

}
