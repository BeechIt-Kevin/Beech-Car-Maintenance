import { Customer } from './customer.interface';
import { Brand } from './brand.interface';
import { SparePart } from './spare-part.interface';

export interface Database {
  customers: Customer[];
  brands: Brand[];
  spareParts: SparePart[];
}
