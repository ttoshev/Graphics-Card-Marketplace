import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { QueryService } from '../query.service';
import { Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';
import { ToastrService } from 'ngx-toastr';


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
   * Inject queryService for getting items from DB, and others
   * @params: queryService
   * @params: authService
   * @params: tostr
   **/ 
  constructor(
    private queryService: QueryService, 
    private authService: AuthService,
    private tostr: ToastrService
  ) { 
    // initial get for all items & item details
    this.getItems();
  }
  
  /**
   * Checks if the ratings of the currently selected item include an entry from the current user
  **/ 
  userCommented(){
    
    for(var one of this.singleItemRatings){
      if(this.authService.isAuthenticated()){
        if (one.userEmail==this.authService.currentUser.email){
           return true; // comment found - user has commented on this item
        }
      }
    }
    return false; // user has not commented on this item
  }
  
  /**
   * Modify an item's details (Manager only)
   **/
  modifyItem(id, name, quantity, price){
    
    // create the item object
    let item = {
      'id':id,
      'name': name,
      'quantity': quantity,
      'price': price
    }
    
    // send the item object to query service
    this.queryService.postItemUpdate(item)
    .subscribe((data)=>{
      console.log(data);
    });
    
    // successfully modified item
    this.tostr.success('Item updated!', 'Success!');
  }
  
  /**
   * Remove/delete an item (Manager only)
   **/
  removeItem(id){
    
    this.queryService.postRemoveItem(id)
    .subscribe((data)=>{
      console.log(data);
    });
    
    // successfully removed item
    this.tostr.warning('Item removed!', 'Success!');

  }
  
  /**
   * Add a new item (Manager only)
   **/
  addItem(name,price,quantity,imageLink){
    
    // create the item object
    let newItem={
      'name': name,
      'price': price,
      'quantity': quantity,
      'link': imageLink
    };

    // send the item object to the query service
    this.queryService.postAddItem(newItem).subscribe((data)=>{
      console.log(data);
    });
    
    // successfully added item
    this.tostr.success('Item added!', 'Success!');
  }
  
  /**
   * Get up-to-date information about items and their ratings
   **/
  getItems(){
    
    // reset both arrays
    this.items=[];
    this.ratings=[];
    
    // call the getItems function from the query service
    this.queryService.getItems()
    .subscribe((data)=>{
      // push all items to item array
      for(var x in data){
        this.items.push(data[x]);
      }
       
    })
    
    //call the get getRatings function from the query service
    this.queryService.getRatings()
    .subscribe((data)=>{
      // push all items to ratings array
      for(var x in data){
        this.ratings.push(data[x]);
      }
       
    });
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

  // do not display the item if it's stock is below 1 (i.e no more in stock)
  checkStock(itemStock){
    var stock = parseFloat(itemStock);
    if (stock<1){
      return false;
    }
    return true;
  }
  
  
  /**
   * Called when user submits a rating and comment
   **/
  onSubmit(entry,itemId){
    
    // input validation
    if (parseFloat(entry.value.rate)>5||parseFloat(entry.value.rate)<0){
      alert('Invalid Rating! Must be between 0 and 5 stars');
      return;
    }
    
    // confirmation
    if (!confirm("Add this comment?")){
      return;
    }
    
    // comment shown to users by default
    var hidden=false;
    
    // get the poster's email
    var userEmail = this.authService.currentUser.email;
    
    // send the comment information to the query service
    this.queryService.postComment(entry,userEmail,itemId,hidden);
    
    // hide the item (minimize, show less detail)
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
    
    // show the number of stars associeted with the current rating
    this.selectionStars=[]; // reset the number of stars
    if(!isNaN(numAltered)){
      this.selectionStars=Array(numAltered).fill(1);
    }
    return;
  }
  
  /**
   * Mark a comment as visible (Manager only)
   **/ 
  showComment(id){
    
    this.queryService.postCommentStatus(id, false)
    .subscribe((data)=>{
    
    });
    this.tostr.success('Comment shown!', 'Success!');
  }
  
  /**
   * Mark a comment as hidden (Manager only)
   **/ 
  hideComment(id){
    this.queryService.postCommentStatus(id, true)
    .subscribe((data)=>{
      
    });
    this.tostr.warning('Comment hidden!', 'Success!');
  }
  
  ngOnInit() {
  }
}
