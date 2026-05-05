import { Component, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SparePart } from '../../interfaces/spare-part.interface';
import { BeechCarMaintenanceDatabaseService } from '../../service/DatabaseService/beech-car-maintenance-database.service';

@Component({
  selector: 'app-manage-spare-part',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-spare-part.component.html',
  styleUrls: ['./manage-spare-part.component.scss']
})
export class ManageSparePartComponent {
  private router = inject(Router);
  private dbService = inject(BeechCarMaintenanceDatabaseService);

  public spareParts = this.dbService.getSpareParts();
  public brands = this.dbService.getBrands();
  
  public searchQuery = signal('');

  public filteredParts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.spareParts();
    if (!query) return all;
    return all.filter(p => p.name.toLowerCase().includes(query));
  });

  part: Partial<SparePart> = {
    name: '',
    brandId: undefined,
    price: undefined
  };

  getBrandName(brandId: number): string {
    const brand = this.brands().find(b => b.id === brandId);
    return brand ? brand.brandName : 'Unknown Brand';
  }

  onSubmit(): void {
    const success = this.dbService.addSparePart(this.part);
    
    if (success) {
      alert('Spare part successfully registered!');
      this.part = { name: '', brandId: undefined, price: undefined };
    } else {
      alert('Error: Check if all fields are filled and if this part already exists for the selected brand.');
    }
  }

  cancel(): void {
    this.router.navigate(['/manage-database']);
  }
}
