import { Customer } from './customer.interface';

export interface RegisterItem {
  addCustomerJob(customer: Partial<Customer>): boolean;
}
