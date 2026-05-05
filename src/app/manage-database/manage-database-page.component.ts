import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-database-page',
  standalone: true,
  templateUrl: './manage-database-page.component.html',
  styleUrls: ['./manage-database-page.component.scss']
})
export class ManageDatabasePageComponent {
  private router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
