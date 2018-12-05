import { Component, OnInit } from '@angular/core';
import { QueryService } from '../query.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  complaints=[];
  
  constructor(
    private queryService: QueryService, 
    private authService: AuthService,
    private tostr: ToastrService
    ) {
      this.getComplaints();
      
    }

  ngOnInit() {
  }
  
  submit(title, description){
    console.log(title+'/'+description);
    this.queryService.addComplaint(this.authService.currentUser.email,title,description)
    .subscribe((data)=>{
      
    })
    this.tostr.success('Report logged!', 'Success!');
  }

  getComplaints(){
    this.complaints=[];
    this.queryService.getComplaints()
    .subscribe((data)=>{
      for (var x in data){
        this.complaints.push(data[x]);
      }
      console.log(this.complaints);
    })
  }
}
