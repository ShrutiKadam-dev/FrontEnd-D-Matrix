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
import { FormArray } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
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
  displayUnderlyingModal = false;
  underlyingForm!: FormGroup;
  displayActionTableModal = false;
  actionTableForm: FormGroup;
  selectedEntityId: string | null = null;

  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  categoryOptions = [
    { label: 'Equity', value: 'Equity' },
    { label: 'Fixed Income', value: 'Fixed_Income' },
    { label: 'Commodities', value: 'Commodities' }
  ];

  orderTypeOptions = [
    { label: 'Purchase', value: 'Purchase' },
    { label: 'Sell', value: 'Sell' }
  ];

  modeOptions = [
    { label: 'Demat', value: 'Demat' }
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

  // For dynamic label rendering in HTML
  actionTableFields = [
    { key: 'scrip_code', label: 'Scrip Code' },
    { key: 'mode', label: 'Mode' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'sett_no', label: 'Settelement no' },
    { key: 'scrip_name', label: 'Scrip Name' },
    { key: 'isin', label: 'ISIN' },
    { key: 'order_number', label: 'Order Number' },
    { key: 'folio_number', label: 'Folio Number' },
    { key: 'nav', label: 'NAV' },
    { key: 'stt', label: 'STT' },
    { key: 'unit', label: 'Unit' },
    { key: 'redeem_amount', label: 'Redeem Amount' },
    { key: 'purchase_amount', label: 'Purchase Amount' },
    { key: 'purchase_value', label: 'Purchase Value' },
    { key: 'cgst', label: 'CGST' },
    { key: 'sgst', label: 'SGST' },
    { key: 'ugst', label: 'UGST' },
    { key: 'igst', label: 'IGST' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'cess_value', label: 'Cess Value' },
    { key: 'net_amount', label: 'Net Amount' },
  ];

  private calculatePurchaseValue(): void {
    const unit = Number(this.actionTableForm.get('unit')?.value) || 0;
    const nav = Number(this.actionTableForm.get('nav')?.value) || 0;
    const total = unit * nav;
    this.actionTableForm.get('purchase_value')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({
      scripname: ['', Validators.required],
      scripcode: ['', Validators.required],
      nickname: [''],
      benchmark: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      isin: ['', Validators.required],
    });


    this.actionTableForm = this.fb.group({
      scrip_code: ['', Validators.required],
      mode: ['', Validators.required],
      order_type: ['', Validators.required],
      order_date: ['', Validators.required],
      sett_no: ['', Validators.required],
      scrip_name: ['', Validators.required],
      isin: ['', Validators.required],
      order_number: ['', Validators.required],
      folio_number: ['', Validators.required],
      nav: ['', Validators.required],
      stt: ['', Validators.required],
      unit: ['', Validators.required],
      redeem_amount: ['', Validators.required],
      purchase_amount: ['', Validators.required],
      purchase_value: [{ value: '', disabled: true }, Validators.required],
      cgst: ['', Validators.required],
      sgst: ['', Validators.required],
      ugst: ['', Validators.required],
      igst: ['', Validators.required],
      stamp_duty: ['', Validators.required],
      cess_value: ['', Validators.required],
      net_amount: ['', Validators.required],
      entityid: ['', Validators.required] // Hidden field for entity ID

    });

    // Auto-calculate purchase_value when unit or nav changes
    this.actionTableForm.get('unit')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.actionTableForm.get('nav')?.valueChanges.subscribe(() => this.calculatePurchaseValue());

    this.entityForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.subCategoryOptions = this.allSubCategoryOptions[selectedCategory] || [];
      this.entityForm.get('subcategory')?.reset();
    });
  }

  ngOnInit() {
    this.getEntities();

    this.underlyingForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });

  }

  get rows(): FormArray {
    return this.underlyingForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      company_name: ['', Validators.required],
      scripcode: ['', Validators.required],
      sector: ['', Validators.required],
      weightage: ['', Validators.required],
      isin_code: ['', Validators.required]
    });
  }

  addRow() {
    this.rows.push(this.createRow());
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  openUnderlyingModal(): void {
    this.displayUnderlyingModal = true;
    if (this.rows.length === 0) {
      this.addRow();
    }
  }


  showUnderlyingModal(entity?: any) {
    this.underlyingForm.reset();
    this.rows.clear();
    this.addRow(); // start with 1 row
    this.displayUnderlyingModal = true;
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
    const updatedData = {
      id: this.selectedEntity.id,
      ...this.entityForm.value
    };

    this.featuresService.updateEntity(updatedData).subscribe({
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
    this.selectedEntity = entity;
    this.displayUpdateChoiceModal = true;
  }

  resetForm() {
    this.entityForm.reset();
    this.isEditMode = false;
    this.selectedEntity = null;
    this.displayModal = false;
  }

  updateUnderlyingTable(entity: any) {
    this.selectedEntityId = entity.entityid; // or entity.entityid depending on your API
    this.underlyingForm.reset();
    this.rows.clear();
    this.addRow(); // start with one row
    this.displayUnderlyingModal = true;
  }


  updateContractNoteTable() {
    this.displayUpdateChoiceModal = false;
  }

  submitUnderlyingData(): void {
    if (this.underlyingForm.valid && this.selectedEntityId) {
      const payload = {
        entityid: this.selectedEntityId,
        rows: this.underlyingForm.value.rows
      };

      this.featuresService.addUnderlyingTable(payload).subscribe({
        next: (res: any) => {
          console.log('Data saved successfully', res);
          this.displayUnderlyingModal = false;
          this.underlyingForm.reset();
          this.underlyingForm.setControl('rows', this.fb.array([this.createRow()]));
        },
        error: (err: any) => {
          console.error('Error saving data', err);
        }
      });
    } else {
      this.underlyingForm.markAllAsTouched();
    }
  }
  onUpdate(entity: any) {
    this.selectedEntity = entity;
    this.displayUpdateChoiceModal = true;
  }

  updateActionTable(entity: any) {
    this.selectedEntity = entity;
    this.actionTableForm.reset();

    this.actionTableForm.patchValue({
      entityid: entity.entityid,
      scrip_code: entity.scripcode,
      scrip_name: entity.scripname,
      isin: entity.isin
    });

    this.displayUpdateChoiceModal = false;
    this.displayActionTableModal = true;
  }

  isReadOnlyField(key: string): boolean {
    return ['scrip_code', 'scrip_name', 'isin'].includes(key);
  }

  saveActionTableData() {
    if (this.actionTableForm.invalid) return;

    const payload = this.actionTableForm.getRawValue();

    this.featuresService.insertActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Action table data added successfully'
        });
        this.displayActionTableModal = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to add action table data'
        });
      }
    });
  }
}


