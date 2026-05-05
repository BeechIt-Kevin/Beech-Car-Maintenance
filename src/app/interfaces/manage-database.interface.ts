import { Signal } from '@angular/core';
import { Customer } from './customer.interface';
import { Brand } from './brand.interface';

export interface ManageDatabase {
  getCustomers(): Signal<Customer[]>;
  addCustomerJob(customer: Partial<Customer>): boolean;
  getBrands(): Signal<Brand[]>;
  addBrand(brand: Partial<Brand>): boolean;
  cleanLocalStorage(): void;
  downloadDbAsJson(): void;
}
