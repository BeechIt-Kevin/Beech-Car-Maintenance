import { Component, signal } from '@angular/core';

@Component({
  selector: 'maintenance-app',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Beech-Car-Maintenance');
}
