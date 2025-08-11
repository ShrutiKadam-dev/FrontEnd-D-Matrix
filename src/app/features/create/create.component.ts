import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  displayModal = false;
  entityForm: FormGroup;
  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  private featuresService = inject(FeaturesService);
  messages: Message[] = [];

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
    this.displayModal = true;
  }

getEntities() {
  this.featuresService.getAllEntities().subscribe({
    next: (data: any) => {
      console.log('Entities API Response:', data);
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


  getCategoryLabel(value: string): string {
    return this.categoryOptions.find(opt => opt.value === value)?.label || value;
  }

  getSubCategoryLabel(categoryValue: string, subValue: string): string {
    const subOptions = this.allSubCategoryOptions[categoryValue] || [];
    return subOptions.find(opt => opt.value === subValue)?.label || subValue;
  }

  addEntity() {
    const formData = this.entityForm.value;

    this.featuresService.createEntity(formData).subscribe({
      next: () => {
        this.messages = [{
          severity: 'success',
          summary: 'Success',
          detail: 'Entity added successfully'
        }];
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
}
