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
  // the item details
  items=[];
  
  /**
   * Inject queryService for getting items from DB
   * @params: queryService
   **/ 
  constructor(private queryService: QueryService) { 
    console.log('constructor of items...')
    
    this.queryService.getItems()
    .subscribe((data)=>{
      
      for(var x in data){
        this.items.push(data[x]);
      }
       
    })
  }

  ngOnInit() {
  }
  
  

}
