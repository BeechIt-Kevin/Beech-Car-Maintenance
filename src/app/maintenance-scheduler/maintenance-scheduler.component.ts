import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-scheduler',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './maintenance-scheduler.component.html',
  styleUrls: ['./maintenance-scheduler.component.scss']
})
export class MaintenanceSchedulerComponent {
  // Empty arrays for dropdown options, to be populated later
  customers: any[] = [];
  cars: any[] = [];
  maintenanceJobs: any[] = [];
  timeSlots: any[] = [];
  engineers: any[] = [];
  spareParts: any[] = [];

  // Properties to hold the user's selections
  selectedCustomer: any = null;
  selectedCar: any = null;
  selectedJob: any = null;
  selectedTimeSlot: any = null;
  selectedEngineer: any = null;
  selectedPart: any = null;

  constructor() { }

  /**
   * Calculates the total price for servicing a car.
   * Will include weekend/weekday rates, fixed service hours, spare parts, and VAT.
   */
  calculateTotalPrice(): void {
    // TODO: Implement calculation logic based on the selected dropdown values
    console.log('Calculating total price for the scheduled maintenance job...');
  }
}
