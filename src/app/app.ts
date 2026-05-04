import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'maintenance-app',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private router: Router) {}

  navigateToScheduling(): void {
    // Navigates to the core assignment functionality
    this.router.navigate(['/maintenance-scheduler']); 
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']); 
  }
}
