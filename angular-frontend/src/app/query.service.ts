import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QueryService {
   //http header options
  _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  };

  constructor(private http : HttpClient) {
    
  }
  
  getItems(){
    return this.http.get('/api/home');
  }
  
  //post request
  addItem(formData){
    let theItem = {
      'itemName': formData.itemName;
      'itemPrice': formData.itemPrice,
      'itemQuantity': formData.itemQuantity,
      'imageLink': formData.imageLink
    }
    console.log(theItem);
    //TODO - modify this
    return this.http.post('/api/add/'+formData.itemName+'/'+formData.itemPrice+'/'+formData.itemQuantity+'/'+formData.imageLink,theItem, this._options);
  }
  
  //post request
  addUser(email : string){
    return;
    // let theUser = {
    //   'email':_product
    // }
    // console.log(theItem);
    // return this.http.post('/api/add/'+email, this._options);
  }
}
