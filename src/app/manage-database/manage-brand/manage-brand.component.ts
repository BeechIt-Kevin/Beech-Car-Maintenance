import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Brand } from '../../interfaces/brand.interface';
import { BeechCarMaintenanceDatabaseService } from '../../service/DatabaseService/beech-car-maintenance-database.service';

@Component({
  selector: 'app-manage-brand',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss']
})
export class ManageBrandComponent {
  private router = inject(Router);
  private dbService = inject(BeechCarMaintenanceDatabaseService);

  public brands = this.dbService.getBrands();
  
  public searchQuery = signal('');

  public filteredBrands = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.brands();
    if (!query) return all;
    return all.filter(b => b.brandName.toLowerCase().includes(query));
  });

  brand: Partial<Brand> = {
    brandName: ''
  };

  onSubmit(): void {
    const success = this.dbService.addBrand(this.brand);
    
    if (success) {
      alert('Brand successfully registered!');
      this.brand = { brandName: '' };
    } else {
      alert('Error: A brand with this exact name already exists in the database.');
    }
  }

  cancel(): void {
    this.router.navigate(['/manage-database']);
  }
}
