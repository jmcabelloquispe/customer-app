import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { CustomerI } from '../models/customer.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
}) 
export class CustomerService {

  customersCollection: AngularFirestoreCollection<CustomerI>;
  customers: Observable<CustomerI[]>;

  constructor(public db: AngularFirestore, private datePipe: DatePipe) {
    this.customersCollection = this.db.collection('customers');
    this.customers = this.customersCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as CustomerI;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
    birthdate: new FormControl('', Validators.required),
  });

  info: FormGroup = new FormGroup({
    name: new FormControl(''),
    lastName: new FormControl(''),
    age: new FormControl(''),
    birthdate: new FormControl(''),
    deathDate: new FormControl(''),
  });

  initializeFormGroup() {
    this.form.setValue({
      id: null,
      name: '',
      lastName: '',
      age: '',
      birthdate: '',
    });
  }

  getCustomers() {
    return this.customers
  }

  updateCustomer(customer: CustomerI){
    let deathDate = new Date(customer.birthdate);
    this.customersCollection.doc(customer.id).update(
      {
        name: customer.name,
        lastName: customer.lastName,
        age: customer.age,
        birthdate: this.datePipe.transform(customer.birthdate, 'yyyy-MM-dd'),
        // se calcula sobre la esperanza de vida mundial 72
        deathDate : this.datePipe.transform(deathDate.setFullYear(deathDate.getFullYear() + 72), 'yyyy-MM-dd')
      }
    );
  }

  deleteCustomer(id: string){
    return this.customersCollection.doc(id).delete();
  }

  insertCustomer(customer:CustomerI){
    let deathDate = new Date(customer.birthdate);
    this.customersCollection.add({
      name: customer.name,
      lastName: customer.lastName,
      age: customer.age,
      birthdate: customer.birthdate == "" ? "" : this.datePipe.transform(customer.birthdate, 'yyyy-MM-dd'),
      // se calcula sobre la esperanza de vida mundial 72
      deathDate : this.datePipe.transform(deathDate.setFullYear(deathDate.getFullYear() + 72), 'yyyy-MM-dd')
    });
  }

  populateForm(customer) {
    this.form.setValue(
      {
        id: customer.id,
        name: customer.name,
        lastName: customer.lastName,
        age: customer.age,
        birthdate: customer.birthdate,
      }
    );
  }

  async someFunction(){
    
   }

  async populateInfo(customer) {
    this.info.setValue(
      {
        name: customer.name,
        lastName: customer.lastName,
        age: customer.age,
        birthdate: customer.birthdate,
        deathDate: customer.deathDate,
      }
    );
  }

}