import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BeechCarMaintenanceDatabaseService } from './service/DatabaseService/beech-car-maintenance-database.service';

@Component({
  selector: 'maintenance-app',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  private dbService = inject(BeechCarMaintenanceDatabaseService);

  navigateToScheduling(): void {
    // Navigates to the core assignment functionality
    this.router.navigate(['/maintenance-scheduler']);
  }

  navigateToManageCustomer(): void {
    this.router.navigate(['/manage-customer']);
  }

  navigateToManageDatabase(): void {
    this.router.navigate(['/manage-database']);
  }

  downloadDatabase(): void {
    this.dbService.downloadDbAsJson();
  }
}
