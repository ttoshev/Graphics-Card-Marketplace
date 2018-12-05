import { Component, OnInit } from '@angular/core';
import { QueryService } from '../query.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  // the list of users
  users = [];
  managers = [];
  thisUser;
  
  constructor(private queryService: QueryService, private authService: AuthService, private router: Router) {
    if(!this.authService.isManager()){
      this.router.navigate(['/home']);
    }
    this.getAll();
  }

  ngOnInit() {
  }
  
  /**
   * Fetch all registered users
   **/ 
  getAll(){
    this.managers=[];
    this.users = [];

    // manager query
    this.queryService.getManagers()
    .subscribe((data)=>{
      // add all managers first
      for (var x in data){
        this.managers.push(data[x])
      }
      
      // all users query
      this.queryService.getUsers()
      .subscribe((data)=>{
        // add the user to the users array only if they are not already in managers array
        for(var x in data){
          var a=true;
          for (var y in this.managers){
            if (data[x].userEmail==this.managers[y].userEmail){
              a=false;
              break;
            }
          }
          if(a){
            this.users.push(data[x]);
          }
        }

      });
    });
  }
  
  /**
   * Disable a user in firebase db
   **/
  disableUser(email){
    this.queryService.postStatus(email,true)
    .subscribe((data)=>{
    });
    
  }
  
  /**
   * Enable a user in firebase db
   **/
  enableUser(email){
    this.queryService.postStatus(email,false)
    .subscribe((data)=>{
        //this.getAll();
    });
   
  }
  
  /**
   * Fetch a user from the firebase db
   **/
  getUser(email){
    this.queryService.getSingleUser(email)
    .subscribe((data)=>{
      this.thisUser=data;
    });
    
  }
  
  /**
   * Grant manager permissions for a user
   **/
  makeManager(email){
    this.queryService.postManager(email)
    .subscribe((data)=>{
      
    });
    
  }

}
