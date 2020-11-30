import { Component, OnInit} from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatDialogRef } from '@angular/material';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  constructor(
    public customer: CustomerService, 
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.customer.form.valid) {
      if (!this.customer.form.get('id').value)
        this.customer.insertCustomer(this.customer.form.value);
      else
        this.customer.updateCustomer(this.customer.form.value);
      this.customer.form.reset();
      this.customer.initializeFormGroup();
      this.notificationService.success('Guardado satisfactoriamente');
      this.onClose();
    }
  }

  onClose() {
    this.customer.form.reset();
    this.customer.initializeFormGroup();
    this.dialogRef.close();
  }
}
