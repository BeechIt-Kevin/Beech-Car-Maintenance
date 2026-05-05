import { Customer } from './customer.interface';
import { Brand } from './brand.interface';

export interface Database {
  customers: Customer[];
  brands: Brand[];
}
