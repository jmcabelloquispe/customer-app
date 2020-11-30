import { Component, OnInit } from '@angular/core';
import { MatTableDataSource}  from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { NotificationService } from '../../services/notification.service';
import { std } from 'mathjs';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastName', 'age', 'birthdate', 'actions', 'deathDate'];
  dataSource = new MatTableDataSource();
  averageAges: number = 0;
  standardDeviationAges: number = 0

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(rest => {
      this.dataSource.data = rest;
      this.averageAges = rest.reduce((a, b) => a + b.age, 0) / rest.length;
      this.standardDeviationAges = std(rest.map(a => a.age));
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onInfo(element){
    this.customerService.populateInfo(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "300px";
    this.dialog.open(CustomerInfoComponent, dialogConfig);
  }

  onEdit(element){
    this.customerService.populateForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "300px";
    this.dialog.open(CustomerFormComponent, dialogConfig);
  }

  onCreate() {
    this.customerService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "300px";
    this.dialog.open(CustomerFormComponent, dialogConfig);
  }

  onDelete(id:string){
    if(confirm('Esta seguro de eliminar este registro?')){
      this.customerService.deleteCustomer(id);
      this.notificationService.warn('Eliminado correctamente!');
    }
  }
}
