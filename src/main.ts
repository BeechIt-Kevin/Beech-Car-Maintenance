import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { MaintenanceSchedulerComponent } from './app/maintenance-scheduler/maintenance-scheduler.component';
import { RegisterPageComponent } from './app/register-page/register-page.component';

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: 'maintenance-scheduler', component: MaintenanceSchedulerComponent },
      { path: 'register', component: RegisterPageComponent }
    ]),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
