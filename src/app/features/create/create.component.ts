import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MessageModule } from 'primeng/message';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    TableModule,
    InputTextModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  displayModal = false;
  entityForm: FormGroup;
  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  isEditMode = false;
  displayUpdateChoiceModal = false;
  selectedEntity: any = null;
  messages: Message[] = [];

  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  categoryOptions = [
    { label: 'Equity', value: 'Equity' },
    { label: 'Fixed Income', value: 'Fixed_Income' },
    { label: 'Commodities', value: 'Commodities' }
  ];

  allSubCategoryOptions: Record<string, any[]> = {
    Equity: [
      { label: 'Direct Equity', value: 'Direct Equity' },
      { label: 'Mutual Fund', value: 'Mutual Fund' },
      { label: 'Alternative Investment Funds', value: 'Alternative Investment Funds' },
      { label: 'Direct PE', value: 'Direct PE' },
      { label: 'PE AIF', value: 'PE AIF' }
    ],
    Fixed_Income: [
      { label: 'Direct Debt', value: 'Direct Debt' },
      { label: 'REIT', value: 'REIT' },
      { label: 'INVIT', value: 'INVIT' },
      { label: 'Debentures', value: 'Debentures' }
    ],
    Commodities: [
      { label: 'ETF', value: 'ETF' },
      { label: 'Physical', value: 'Physical' }
    ]
  };

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      scripname: ['', Validators.required],
      scripcode: ['', Validators.required],
      nickname: [''],
      benchmark: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
    });

    this.entityForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.subCategoryOptions = this.allSubCategoryOptions[selectedCategory] || [];
      this.entityForm.get('subcategory')?.reset();
    });
  }

  ngOnInit() {
    this.getEntities();
  }

  showModal() {
    this.isEditMode = false; // Always set to create mode
    this.entityForm.reset(); // Clear previous form values
    this.displayModal = true;
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }

  getEntities() {
    this.featuresService.getAllEntities().subscribe({
      next: (data: any) => {
        this.entityList = Array.isArray(data.data) ? data.data : [];
      },
      error: (err) => {
        this.messages = [{
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to load entities'
        }];
      }
    });
  }

  addEntity() {
    const formData = this.entityForm.value;

    this.featuresService.createEntity(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Entity added successfully' });
        this.entityForm.reset();
        this.displayModal = false;
        this.getEntities();
      },
      error: (error) => {
        this.messages = [{
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Something went wrong'
        }];
      }
    });
  }

  editEntity(entity: any) {
    this.isEditMode = true;
    this.selectedEntity = entity;

    this.entityForm.patchValue({
      scripname: entity.scripname,
      scripcode: entity.scripcode,
      nickname: entity.nickname,
      benchmark: entity.benchmark,
      category: entity.category,
      subcategory: entity.subcategory
    });

    this.subCategoryOptions = this.allSubCategoryOptions[entity.category] || [];
    this.displayModal = true;
  }

  saveUpdatedEntity() {
    const updatedData = this.entityForm.value;
    this.featuresService.updateEntity(this.selectedEntity.id, updatedData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Entity updated successfully' });
        this.resetForm();
        this.getEntities();
      },
      error: (error) => {
        this.messages = [{
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        }];
      }
    });
  }

  updateEntity(entity: any) {
    this.displayUpdateChoiceModal = true;
  }

  resetForm() {
    this.entityForm.reset();
    this.isEditMode = false;
    this.selectedEntity = null;
    this.displayModal = false;
  }

  updateUnderlyingTable() {
    this.displayUpdateChoiceModal = false;
  }

  updateContractNoteTable() {
    this.displayUpdateChoiceModal = false;
  }
}
