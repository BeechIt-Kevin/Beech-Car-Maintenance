import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../interfaces/customer.interface';
import { BeechCarMaintenanceDatabaseService } from '../../service/DatabaseService/beech-car-maintenance-database.service';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.scss']
})
export class RegisterCustomerComponent {
  private router = inject(Router);
  private dbService = inject(BeechCarMaintenanceDatabaseService);

  public customers = this.dbService.getCustomers();
  
  public searchQuery = signal('');

  public filteredCustomers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.customers();
    if (!query) return all;
    return all.filter(c => c.CustomerName.toLowerCase().includes(query));
  });

  customer: Partial<Customer> = {
    CustomerName: '',
    email: '',
    phoneNumber: ''
  };

  onSubmit(): void {
    const success = this.dbService.addCustomerJob(this.customer);
    
    if (success) {
      alert('Customer successfully registered!');
      // Reset the form instead of navigating away so they can see the updated list
      this.customer = { CustomerName: '', email: '', phoneNumber: '' };
    } else {
      alert('Error: A customer with this exact information already exists in the database.');
    }
  }

  cancel(): void {
    this.router.navigate(['/register']);
  }
}
