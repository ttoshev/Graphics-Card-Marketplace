import { Component, OnInit } from '@angular/core';
// import { QueryService } from '../query.service';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items=[1,2,3,4];
  constructor( 
    private router: Router
    // private queryService: QueryService, 
    // private authService: AuthService,
    // private tostr: ToastrService)
    )
    {
      
    }

  ngOnInit() {
  }
  
  addToCart(name){
    this.items.push(name);
    console.log(this.items);
    this.router.navigateByUrl('/home', { skipLocationChange: true });
    this.router.navigate(["cart"]);
  }

}
