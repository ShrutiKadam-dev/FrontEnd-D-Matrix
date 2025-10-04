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
  filteredEntity2List: any[] = [];

  selectedEntity1: any = null;
  selectedEntity2: any = null;
  comparisonResult: number | null = null;

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

    const { entity1, entity2 } = this.compareForm.value;

    this.selectedEntity1 = this.entityList.find(e => e.scripcode === entity1);
    this.selectedEntity2 = this.entityList.find(e => e.scripcode === entity2);

    this.comparisonResult = Math.floor(Math.random() * 100);

    this.messageService.add({
      severity: 'info',
      summary: 'Compare Triggered',
      detail: `Comparing ${this.selectedEntity1?.scripname} with ${this.selectedEntity2?.scripname}`
    });
  }
}