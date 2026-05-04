import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root' // Provided at the app level
})
export class BeechCarMaintenanceDatabaseService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'beech_car_maintenance_db';

  // Angular Signal to store the database state reactively
  public dbState = signal<any[]>([]);

  constructor() {
    console.log('BeechCarMaintenanceDatabaseService constructor');
    // Automatically load data when the service is injected
    this.read();
  }

  /**
   * READ: Checks localStorage first. If empty, loads from a local JSON file.
   */
  public read(): void {
    const localData = localStorage.getItem(this.STORAGE_KEY);
    
    if (localData) {
      // Load saved state from localStorage
      this.dbState.set(JSON.parse(localData));
    } else {
      // Fallback: Read from a 'data.json' file hosted in your public/ directory
      this.http.get<any[]>('/data.json').pipe(
        tap(initialData => {
          this.dbState.set(initialData);
          // Write this initial data to localStorage for future use
          this.write(initialData); 
        }),
        catchError(error => {
          console.error('Could not read the JSON file:', error);
          return of([]);
        })
      ).subscribe();
    }
  }

  /**
   * WRITE: Updates the Signal and persists the changes to localStorage
   */
  public write(newData: any[]): void {
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
}
