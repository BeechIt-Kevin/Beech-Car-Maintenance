import { Signal } from '@angular/core';
import { Customer } from './customer.interface';

export interface ManageDatabase {
  getCustomers(): Signal<Customer[]>;
  addCustomerJob(customer: Partial<Customer>): boolean;
}
