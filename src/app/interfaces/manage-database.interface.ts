import { Signal } from '@angular/core';
import { Customer } from './customer.interface';
import { Brand } from './brand.interface';
import { SparePart } from './spare-part.interface';



export interface ManageDatabase {
  getCustomers(): Signal<Customer[]>;
  addCustomerJob(customer: Partial<Customer>): boolean;
  getBrands(): Signal<Brand[]>;
  addBrand(brand: Partial<Brand>): boolean;
  getSpareParts(): Signal<SparePart[]>;
  addSparePart(part: Partial<SparePart>): boolean;
  cleanLocalStorage(): void;
  downloadDbAsJson(): void;
}
