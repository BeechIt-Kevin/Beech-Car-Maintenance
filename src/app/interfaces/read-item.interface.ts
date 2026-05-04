import { Signal } from '@angular/core';
import { Customer } from './customer.interface';

export interface ReadItem {
  getCustomers(): Signal<Customer[]>;
}
