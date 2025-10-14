import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FeaturesService } from '../features.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-compare',
  imports: [
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule
  ],
  providers: [ MessageService],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss'
})
export class CompareComponent implements OnInit {
 
  private messageService = inject(MessageService);
  private featuresService = inject(FeaturesService);
  private fb = inject(FormBuilder);

  compareForm!: FormGroup;
  entityList: any[] = [];
  filteredEntity1List: any[] = [];
  filteredEntity2List: any[] = [];

  selectedEntity1: any = null;
  selectedEntity2: any = null;
  comparisonResult: any | null = null;
  comparisonPercentage: number | null = null

  ngOnInit(): void {
    this.initForm();
    this.getEntities();

    // Watch entity1 changes to filter entity2 options
    this.compareForm.get('entity1')?.valueChanges.subscribe(val => {
      this.filteredEntity2List = this.entityList.filter(e => e.scripcode !== val);
      if (val === this.compareForm.get('entity2')?.value) {
        this.compareForm.get('entity2')?.setValue(null);
      }
    });
  }

  initForm() {
    this.compareForm = this.fb.group({
      entity1: [null, Validators.required],
      entity2: [null, Validators.required]
    });
  }

  getEntities() {
    this.featuresService.getAllEntities().subscribe({
      next: (res: any) => {
        this.entityList = Array.isArray(res.data) ? res.data : [];
        this.filteredEntity2List = [...this.entityList];
        this.filteredEntity1List = [...this.entityList];
        
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to load entities'
        });
      }
    });
  }

  compareEntities(event: Event) {
  event.preventDefault();

  if (this.compareForm.invalid) return;

  const entity1Id = this.compareForm.get('entity1')?.value;
  const entity2Id = this.compareForm.get('entity2')?.value;

  // Find the selected entity objects to get scrip names
const entity1Obj = this.filteredEntity1List.find(e => e.entityid === entity1Id);
const entity2Obj = this.filteredEntity2List.find(e => e.entityid === entity2Id);




this.selectedEntity1 = {
  id: entity1Id,
  scripName: entity1Obj?.scripname || 'N/A'
};

this.selectedEntity2 = {
  id: entity2Id,
  scripName: entity2Obj?.scripname || 'N/A'
};


console.log(this.selectedEntity1, this.selectedEntity2)
  console.log('Comparing IDs:', entity1Id, entity2Id);

  // 🔹 Call your API service
  this.featuresService.compareEntities(entity1Id, entity2Id).subscribe({
    next: (response) => {
      this.comparisonResult = response.data;
      this.comparisonPercentage = this.comparisonResult.overlap?.overlap_percentage_of_mf1 || 0;
      
      
      this.messageService.add({
        severity: 'success',
        summary: 'Comparison Complete',
        detail: `Compared ${entity1Id} with ${entity2Id}`,
      });
    },
    error: (err) => {
      console.error('Error comparing:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to compare entities',
      });
     
    },
    
  });
  
}

}