import { Component, inject } from '@angular/core';
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

  customer: Partial<Customer> = {
    CustomerName: '',
    email: '',
    phoneNumber: ''
  };

  onSubmit(): void {
    const success = this.dbService.addCustomerJob(this.customer);
    
    if (success) {
      alert('Customer successfully registered!');
      this.router.navigate(['/register']);
    } else {
      alert('Error: A customer with this exact information already exists in the database.');
    }
  }

  cancel(): void {
    this.router.navigate(['/register']);
  }
}
