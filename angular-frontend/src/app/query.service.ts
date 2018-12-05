import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CartComponent } from './cart/cart.component';


/**
 * TUTORIAL USED FOR USER AUTHENTICATION WITH FIREBASE
 * https://www.simplifiedcoding.net/firebase-user-authentication-tutorial/
 * https://www.dunebook.com/how-to-set-up-authentication-in-angular-5-with-firebase-firestore/
 **/
 
@Injectable({
  providedIn: 'root'
})
export class QueryService {
  inCart=[];
  // url
  myURL = 'http://se3316-ttoshev-lab5-ttoshev.c9users.io:8081/api/';
   //http header options
  _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  };

  constructor(private http : HttpClient, private cartComponent:CartComponent) {
    
  }
  
  addToCart(name){
    this.cartComponent.addToCart(name);
  }
  
  getCart(){
    return this.inCart;
  }
  
  /**
   * Get all items (from mlab)
   **/ 
  getItems(){
    return this.http.get(this.myURL+'getItems');
  }
  
  /**
   * Get all ratings (from mlab)
   **/ 
  getRatings(){
    return this.http.get(this.myURL+'Ratings');
  }
  
  /**
   * Get all managers (from mlab)
   **/ 
  getManagers(){
    return this.http.get(this.myURL+'Managers')
  }
  
  /**
   * Get all users (from mlab)
   **/ 
  getUsers(){
    return this.http.get(this.myURL+'Users')
  }
  
  /**
   * Get single user (from firebase)
   **/ 
  getSingleUser(email){
    return this.http.get(this.myURL+'User/'+email);
  }
  
  /**
   * Post a new comment to an item
   **/ 
  postComment(formData,uEmail,itemId,hidden){
    
    // create the post
    let thePost = {
      'userEmail': uEmail,
      'itemID': itemId,
      'rate': formData.value.rate,
      'comment': formData.value.comment,
      'hidden':hidden
    }
    
    // send the request
    return this.http.post(this.myURL+'Ratings',thePost, this._options)
    .subscribe((data)=>{

    })
  }
  
  /**
   * Add a new user to users collection in mlab
   **/ 
  postUser(email){
    let theUser={
      'userEmail': email
    }
    
    return this.http.post(this.myURL+'Users',theUser, this._options)
    .subscribe((data)=>{

    })
    
  }
  
  /**
   * Add a new manager to managers collection in mlab
   **/ 
  postManager(email){
    let theUser={
      'userEmail': email
    }
    
    return this.http.post(this.myURL+'Managers',theUser, this._options);
    
  }
  
  /**
   * Change the status of a user in firebase (disabled/enabled)
   **/ 
  postStatus(email, status){
    // create the user
    let theUser={
      'userEmail': email,
      'disabledStatus': status
    }
    
    // send the request
    return this.http.post(this.myURL+'changeDisabled',theUser, this._options);
  }
  
  /**
   * Hide/show a given comment
   **/ 
  postCommentStatus(commentID, stat){
    
    // set up the comment to modify and its status
    let theComment={
      '_id': commentID,
      'hidden': stat
    }
    
    // send the request
    return this.http.post(this.myURL+'changeHidden',theComment, this._options);
  }
  
  /**
   * Modify an item in mlab collection
   **/
  postItemUpdate(anItem){
    return this.http.post(this.myURL+'modifyItem',anItem,this._options);
  }
  
  /**
   * Remove an item from mlab collection
   **/ 
  postRemoveItem(id){
    
    // set up the item to remove
    let myObject={
      'id':id,
      'why':'im not sure'
    }
    
    // send the request
    return this.http.post(this.myURL+'removeItem',myObject,this._options);
  }
  
  /**
   * Add a new item to the mlab collection
   **/ 
  postAddItem(anItem){
    return this.http.post(this.myURL+'addItem',anItem,this._options);
  }
  
  addComplaint(email,title,description){
    let aComplaint={
      'email':email,
      'title':title,
      '_description': description
    }
    return this.http.post(this.myURL+'Complaint', aComplaint,this._options);
  }
  
  getComplaints(){
    return this.http.get(this.myURL+'Complaint');

  }
}
