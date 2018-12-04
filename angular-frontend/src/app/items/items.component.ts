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
  // the # of stars that a clicked item has (which is average rating rounded)
  numberofstars=[];
  // the stars shown when adding a comment... change asynchronously based on user input
  selectionStars=[];

  /**
   * Inject queryService for getting items from DB
   * @params: queryService
   **/ 
  constructor(private queryService: QueryService, private authService: AuthService) { 
    // initial get for all items & item details
    this.getItems();
  }
  
  /**
   * This function stops a user from commenting on an item if they have already done so before.
  **/ 
  userCommented(){
    for(var one of this.singleItemRatings){
      if(this.authService.isAuthenticated()){
        if (one.userEmail==this.authService.currentUser.email){
           return true;
        }
      }
    }
    return false;
  }
  
  // updates the arrays for items and item details
  getItems(){
    this.items=[];
    this.ratings=[];
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
    
    // round to nearest number to display stars
    this.averageRating=Math.round(sum/this.singleItemRatings.length);
    
    // show stars if average rating can be calculated
    if(!isNaN(this.averageRating)){
      this.numberofstars=Array(this.averageRating).fill(1); // for use in *ngFor statement
    }
    

    // select the clicked item to show the details for
    this.detailedItemID=id;
      
  }

  checkStock(itemStock){
    var stock = parseFloat(itemStock);
    if (stock<1){
      return false
    }
    return true;
  }
  /**
   * Called when user submits a rating and comment
   **/
  onSubmit(entry,itemId){
    
    if (parseFloat(entry.value.rate)>5||parseFloat(entry.value.rate)<0){
      alert('Invalid Rating! Must be between 0 and 5 stars');
      
      return;
    }
    
    if (!confirm("Add this comment?")){
      return;
    }
    
    var userEmail = this.authService.currentUser.email;
    this.queryService.postComment(entry,userEmail,itemId);
    //this.getItems();
    this.showDetails(this.detailedItemID);
  }
  
  /**
   * This function configures the stars and comments displayed when a user is entering an item
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
    //(<HTMLInputElement>document.getElementById('ratingy')).value=numAltered.toString();
    
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
