import { Injectable, inject, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Customer } from '../../interfaces/customer.interface';
import { Brand } from '../../interfaces/brand.interface';
import { Database } from '../../interfaces/database.interface';
import { ManageDatabase } from '../../interfaces/manage-database.interface';

@Injectable({
  providedIn: 'root' // Provided at the app level
})
export class BeechCarMaintenanceDatabaseService implements ManageDatabase {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'beech_car_maintenance_db';

  // Angular Signal to store the database state reactively
  public dbState = signal<Database>({ customers: [], brands: [] });

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
    
    // Validate customers array
    if (!Array.isArray(data.customers)) return false;
    const validCustomers = data.customers.every((c: any) => 
      c && typeof c === 'object' &&
      typeof c.id === 'number' &&
      typeof c.customerName === 'string' &&
      typeof c.email === 'string' &&
      typeof c.phoneNumber === 'string' &&
      Array.isArray(c.cars)
    );
    if (!validCustomers) return false;

    // Validate brands array, default to empty array if missing for backwards compatibility
    if (!Array.isArray(data.brands)) {
      data.brands = [];
    } else {
      const validBrands = data.brands.every((b: any) => 
        b && typeof b === 'object' &&
        typeof b.id === 'number' &&
        typeof b.brandName === 'string' &&
        Array.isArray(b.spareParts) &&
        Array.isArray(b.model)
      );
      if (!validBrands) return false;
    }

    return true;
  }

  /**
   * READ: Reads from localStorage first, then falls back to the local data.json file.
   */
  private read(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (this.validateDatabase(parsedData)) {
          this.dbState.set(parsedData);
          return;
        }
      } catch (error) {
        console.error('Error parsing localStorage data', error);
      }
    }

    this.http.get<any>('/data.json').pipe(
      tap(data => {
        if (this.validateDatabase(data)) {
          const hasDuplicates = data.customers.some((customer: Customer, index: number) => 
            data.customers.findIndex((c: Customer) => 
              c.customerName === customer.customerName && 
              c.email === customer.email && 
              c.phoneNumber === customer.phoneNumber
            ) !== index
          );

          if (hasDuplicates) {
            alert('Error: Duplicate customer entries found in data.json. Starting with an empty database.');
            this.dbState.set({ customers: [], brands: [] });
            this.write({ customers: [], brands: [] });
          } else {
            this.dbState.set(data);
            // Sync it to localStorage just to keep write flow consistent
            this.write(data); 
          }
        } else {
          alert('Error: data.json does not match the Database structure. Starting with an empty database.');
          this.dbState.set({ customers: [], brands: [] });
          this.write({ customers: [], brands: [] });
        }
      }),
      catchError(error => {
        console.error('Could not read the JSON file:', error);
        alert('Error: Could not read data.json. Starting with an empty database.');
        const emptyDb = { customers: [], brands: [] };
        this.dbState.set(emptyDb);
        this.write(emptyDb);
        return of(emptyDb);
      })
    ).subscribe();
  }

  /**
   * WRITE: Updates the Signal and persists the changes to localStorage
   */
  private write(newData: Database): void {
    this.dbState.set(newData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
  }

  /**
   * CLEAN: Removes the database from localStorage and reloads from data.json
   */
  public cleanLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.read();
    alert('Local storage has been cleaned and database reset to initial state.');
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
      c.customerName === newCustomer.customerName &&
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
      customerName: newCustomer.customerName || '',
      email: newCustomer.email || '',
      phoneNumber: newCustomer.phoneNumber || '',
      cars: []
    };

    const newState: Database = {
      ...currentState,
      customers: [...currentState.customers, customerToAdd]
    };

    this.write(newState);
    return true; // Successfully added
  }

  /**
   * ReadItem Implementation
   * Returns a computed signal of the customers list.
   */
  public getCustomers(): Signal<Customer[]> {
    return computed(() => this.dbState().customers || []);
  }

  /**
   * Register Brand Implementation
   */
  public addBrand(newBrand: Partial<Brand>): boolean {
    const currentState = this.dbState();
    
    // Check if brand already exists by comparing the name
    const exists = currentState.brands.some((b: Brand) => 
      b.brandName.toLowerCase() === (newBrand.brandName || '').toLowerCase()
    );
    
    if (exists) {
      return false; // Brand with same name already exists
    }

    // Generate a unique ID
    const maxId = currentState.brands.reduce((max: number, item: Brand) => (item.id && typeof item.id === 'number' ? Math.max(max, item.id) : max), 0);
    const uniqueId = maxId + 1;

    const brandToAdd: Brand = {
      id: uniqueId,
      brandName: newBrand.brandName || '',
      spareParts: [],
      model: []
    };

    const newState: Database = {
      ...currentState,
      brands: [...currentState.brands, brandToAdd]
    };

    this.write(newState);
    return true; // Successfully added
  }

  /**
   * Read Brand Implementation
   */
  public getBrands(): Signal<Brand[]> {
    return computed(() => this.dbState().brands || []);
  }
}
