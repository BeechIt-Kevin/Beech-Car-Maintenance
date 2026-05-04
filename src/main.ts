import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { MaintenanceSchedulerComponent } from './app/maintenance-scheduler/maintenance-scheduler.component';

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: 'maintenance-scheduler', component: MaintenanceSchedulerComponent }
    ]),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
