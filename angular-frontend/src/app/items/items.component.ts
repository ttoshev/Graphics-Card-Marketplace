import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { QueryService } from '../query.service';
import { Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  // the item details
  items=[];
  // id of item that was clicked
  detailedItemID;
  // the item ratings (all)
  ratings=[];
  // item ratings for particular item
  singleItemRatings=[];
  // the average rating for the clicked item
  averageRating=0;
  // the stars that a clicked item has (which is average rating)
  numberofstars=[];
  // the stars shown when adding a comment... change based on user input
  selectionStars=[];

  /**
   * Inject queryService for getting items from DB
   * @params: queryService
   **/ 
  constructor(private queryService: QueryService, private authService: AuthService) { 
    // initial get for all items & item details
    this.getItems();
  }
  
  // updates the arrays for items and item details
  getItems(){
    this.queryService.getItems()
    .subscribe((data)=>{
      
      for(var x in data){
        this.items.push(data[x]);
      }
       
    })
    
    this.queryService.getRatings()
    .subscribe((data)=>{
      
      for(var x in data){
        this.ratings.push(data[x]);
      }
       
    })
  }
  
  /**
   * Toggle item details when an item is clicked. If clicked again, removes item details from display
   **/
  showDetails(id){
    
    // close item details (if click is on the opened item)
    if (this.detailedItemID==id){
      this.detailedItemID="";
      return;
    }
    
    // open item details (if click is on another item)
    this.singleItemRatings = [];
    this.numberofstars=[];
    var sum=0;
    
    // add ratings with the id of the clicked item only to another array, singleItemRatings
    for (var x in this.ratings){
      if(this.ratings[x].itemID==id){
          this.singleItemRatings.push(this.ratings[x]);
          
          // sum up all customer ratings - for getting the average rating
          sum=sum+parseFloat(this.ratings[x].rate);
        }
    }
    
    
    this.averageRating=Math.round(sum/this.singleItemRatings.length);
    console.log(this.averageRating)
    if(!isNaN(this.averageRating)){
      this.numberofstars=Array(this.averageRating).fill(1); // for use in *ngFor statement
    }
    
    this.detailedItemID=id;
  }

  /**
   * Called when user submits a rating and comment
   **/
  onSubmit(entry){
    console.log(entry.comment+'/'+entry.rating);
   //console.log(entry);
  }
  
  /**
   * This function configures the stars displayed when a user is entering an item
   **/ 
  changeSelection(num){
    var numAltered = Math.round(parseFloat(num));
    
    // if user input greater than 5
    if (numAltered>5){
      numAltered=5;
    }
    
    // if user input less than 0
    else if (numAltered<0) {
      numAltered=0;
    }
    
    // user input in range, but is decimal
    else{
      numAltered=Math.round(numAltered);
    }
    
    // update DOM
    (<HTMLInputElement>document.getElementById('ratingy')).value=numAltered.toString();
    
    // show the number of stars associeted with the current rating
    this.selectionStars=[]; // reset the number of stars
    if(!isNaN(numAltered)){
      this.selectionStars=Array(numAltered).fill(1);
    }
    return;
  }
  
  ngOnInit() {
  }
}
