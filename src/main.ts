import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { MaintenanceSchedulerComponent } from './app/maintenance-scheduler/maintenance-scheduler.component';
import { ManageCustomerComponent } from './app/manage-database/manage-customer/manage-customer.component';
import { ManageDatabasePageComponent } from './app/manage-database/manage-database-page.component';
import { ManageBrandComponent } from './app/manage-database/manage-brand/manage-brand.component';

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: 'maintenance-scheduler', component: MaintenanceSchedulerComponent },
      { path: 'manage-customer', component: ManageCustomerComponent },
      { path: 'manage-database', component: ManageDatabasePageComponent },
      { path: 'manage-brand', component: ManageBrandComponent }
    ]),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
