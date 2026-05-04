import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RegisterItem } from '../../interfaces/register-item.interface';
import { Customer } from '../../interfaces/customer.interface';
import { Database } from '../../interfaces/database.interface';

@Injectable({
  providedIn: 'root' // Provided at the app level
})
export class BeechCarMaintenanceDatabaseService implements RegisterItem {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'beech_car_maintenance_db';

  // Angular Signal to store the database state reactively
  public dbState = signal<Database>({ customers: [] });

  constructor() {
    console.log('BeechCarMaintenanceDatabaseService constructor');
    // Automatically load data when the service is injected
    this.read();
  }

  /**
   * Validates if the given data matches the Database interface
   */
  private validateDatabase(data: any): data is Database {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.customers)) return false;
    return true;
  }

  /**
   * READ: Checks localStorage first. If empty, loads from a local JSON file.
   */
  public read(): void {
    const localData = localStorage.getItem(this.STORAGE_KEY);
    
    console.log(localData);

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (this.validateDatabase(parsed)) {
          this.dbState.set(parsed);
          return;
        } else {
          alert('Error: Local storage data is corrupted or invalid. Starting with an empty database.');
          this.dbState.set({ customers: [] });
          this.write({ customers: [] });
          return;
        }
      } catch (e) {
        alert('Error: Could not parse local storage data. Starting with an empty database.');
        this.dbState.set({ customers: [] });
        this.write({ customers: [] });
        return;
      }
    }
  }

  /**
   * WRITE: Updates the Signal and persists the changes to localStorage
   */
  public write(newData: Database): void {
    this.dbState.set(newData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
  }

  /**
   * EXPORT: Downloads the current database state as a JSON file
   */
  public downloadDbAsJson(): void {
    // 1. Get the current data from the signal
    const currentData = this.dbState();
    
    // 2. Convert the data to a formatted JSON string
    const jsonString = JSON.stringify(currentData, null, 2);
    
    // 3. Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 4. Create a temporary anchor element to trigger the download
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'beech_car_maintenance_db.json';
    
    // 5. Trigger the download and clean up
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * RegisterItem Implementation
   * Adds a customerJob to the database if it doesn't already exist.
   */
  public addCustomerJob(newCustomer: Partial<Customer>): boolean {
    const currentState = this.dbState();
    
    // Check if customer already exists by comparing the information
    const exists = currentState.customers.some((c: Customer) => 
      c.CustomerName === newCustomer.CustomerName &&
      c.email === newCustomer.email &&
      c.phoneNumber === newCustomer.phoneNumber
    );
    
    if (exists) {
      return false; // Customer with same information already exists
    }

    // Generate a unique ID
    const maxId = currentState.customers.reduce((max: number, item: Customer) => (item.id && typeof item.id === 'number' ? Math.max(max, item.id) : max), 0);
    const uniqueId = maxId + 1;

    const customerToAdd: Customer = {
      id: uniqueId,
      CustomerName: newCustomer.CustomerName || '',
      email: newCustomer.email || '',
      phoneNumber: newCustomer.phoneNumber || '',
      Cars: []
    };

    const newState: Database = {
      ...currentState,
      customers: [...currentState.customers, customerToAdd]
    };

    this.write(newState);
    return true; // Successfully added
  }
}
