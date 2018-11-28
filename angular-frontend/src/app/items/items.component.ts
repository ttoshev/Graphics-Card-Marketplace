import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { QueryService } from '../query.service'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  dataSource;
  
  /**
   * Inject queryService for getting items from DB
   * @params: queryService
   **/ 
  constructor(private queryService: QueryService) { 
    this.queryService.getItems()
    
    .subscribe((data)=>{
      console.log(data); //test get request for query
      this.dataSource=data; 
    })
  }

  ngOnInit() {
  }
  
  

}
