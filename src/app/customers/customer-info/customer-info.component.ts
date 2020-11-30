import { Component, OnInit} from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  constructor(
    public customer: CustomerService, 
  ) { }

  ngOnInit() {
  }
}
