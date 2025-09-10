import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../features.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePicker } from 'primeng/datepicker';
import { InputMask } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import {
  MF_ACTION_TABLE_FIELDS,
  DIRECT_EQUITY_ACTION_TABLE_FIELDS,
  ETF_ACTION_TABLE_FIELDS,
  AIF_ACTION_TABLE_FIELDS
} from '../form-fields.enums';
import {
  CATEGORY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  MODE_OPTIONS,
  ALL_SUBCATEGORY_OPTIONS
} from '../dropdown-options.enums';
import { FormConfig } from '../form-config';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    TableModule,
    DatePicker,
    InputMask,
    ToastModule,
    ProgressSpinnerModule,
    FileUploadModule
  
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  displayModal = false;
  displayAutoModal = false;
  entityForm: FormGroup;
  underlyingForm!: FormGroup;
  navForm: FormGroup;
  automationForm:  FormGroup;
  // Action table forms
  mfActionTableForm: FormGroup;
  directEquityActionTableForm: FormGroup;
  etfActionTableForm: FormGroup;
  aifActionTableForm: FormGroup;

  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  automationSubCategoryOptions: any[] = []; 
  isEditMode = false;
  displayUpdateChoiceModal = false;
  selectedEntity: any = null;

  // Underlying
  displayUnderlyingModal = false;
  selectedEntityId: string | null = null;
  isSubmitting: boolean = false;

  // Contract note modal
  displayActionTableModal = false;

  // NAV
  displayNavModal = false;

  companySuggestions: any[] = [];
  date: Date | undefined = new Date();

  mfActionTableFields = MF_ACTION_TABLE_FIELDS;
  directEquityActionTableFields = DIRECT_EQUITY_ACTION_TABLE_FIELDS;
  etfActionTableFields = ETF_ACTION_TABLE_FIELDS;
  aifActionTableFields = AIF_ACTION_TABLE_FIELDS;

  private confirmationService = inject(ConfirmationService);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  categoryOptions = CATEGORY_OPTIONS;
  orderTypeOptions = ORDER_TYPE_OPTIONS;
  modeOptions = MODE_OPTIONS;
  allSubCategoryOptions = ALL_SUBCATEGORY_OPTIONS;

  private calculatePurchaseValue(): void {
    const unit = Number(this.mfActionTableForm.get('unit')?.value) || 0;
    const nav = Number(this.mfActionTableForm.get('nav')?.value) || 0;
    const total = unit * nav;
    this.mfActionTableForm.get('purchase_value')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  private calculateNetTotalValue(): void {
    const qty = Number(this.directEquityActionTableForm.get('qty')?.value) || 0;
    const trade_price = Number(this.directEquityActionTableForm.get('trade_price')?.value) || 0;
    const total = qty * trade_price;
    this.directEquityActionTableForm.get('net_total')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  constructor(private fb: FormBuilder) {
  const formConfig = new FormConfig(this.fb);

  this.entityForm = formConfig.entityForm();
  this.navForm = formConfig.navForm();
  this.automationForm = formConfig.automationForm();
  this.aifActionTableForm = formConfig.aifActionTableForm();
  this.mfActionTableForm = formConfig.mfActionTableForm();
  this.directEquityActionTableForm = formConfig.directEquityActionTableForm();
  this.etfActionTableForm = formConfig.etfActionTableForm();

    // Auto-calc MF purchase_value
    this.mfActionTableForm.get('unit')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('nav')?.valueChanges.subscribe(() => this.calculatePurchaseValue());

    this.directEquityActionTableForm.get('qty')?.valueChanges.subscribe(() => this.calculateNetTotalValue());
    this.directEquityActionTableForm.get('trade_price')?.valueChanges.subscribe(() => this.calculateNetTotalValue());

    // Subcategory list by category
    this.entityForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.subCategoryOptions = this.allSubCategoryOptions[selectedCategory] || [];
      this.entityForm.get('subcategory')?.reset();
    });

    // Subcategory list by category
    this.automationForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.automationSubCategoryOptions  = this.allSubCategoryOptions[selectedCategory] || [];
      this.automationForm.get('subcategory')?.reset();
    });
  }

  ngOnInit() {
    this.getEntities();

    this.underlyingForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });
  }

  // ---------- Underlying helpers ----------
  get rows(): FormArray {
    return this.underlyingForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    const row = this.fb.group({
      company_name: ['', Validators.required],
      scripcode: ['', Validators.required],
      sector: ['', Validators.required],
      weightage: ['', Validators.required],
      tag: ['', Validators.required],
      isin_code: ['', Validators.required]
    });

    row.get('weightage')?.valueChanges.subscribe(value => {
      this.onWeightageChange(row, value);
    });

    return row;
  }

  onWeightageChange(currentRow: FormGroup, enteredValue: string | number | null) {
    // normalize everything to a number
    const safeValue = enteredValue === null || enteredValue === '' ? 0 : Number(enteredValue);

    const totalExcludingCurrent = this.rows.controls.reduce((sum, group) => {
      if (group !== currentRow) {
        return sum + (Number(group.get('weightage')?.value) || 0);
      }
      return sum;
    }, 0);

    const newTotal = totalExcludingCurrent + safeValue;

    if (newTotal > 100) {
      currentRow.get('weightage')?.setValue(0, { emitEvent: false });

      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Weightage',
        detail: 'Total weightage cannot exceed 100%'
      });
    }
  }


  addRow() {
    const rows = this.underlyingForm.value.rows || [];
    const names = rows.map((row: any) => row.company_name?.trim().toLowerCase());
    const hasDuplicate = names.some((name: string, idx: number) => names.indexOf(name) !== idx);

    if (hasDuplicate) {
      this.messageService.add({ severity: 'warn', summary: 'Duplicate', detail: 'Duplicate company name is not allowed' });
      return;
    }

    this.rows.push(this.createRow());
  }

  removeRow(index: number): void {
    this.rows.removeAt(index);
  }

  openUnderlyingModal(): void {
    this.displayUnderlyingModal = true;
    this.displayUpdateChoiceModal = false;
    if (this.rows.length === 0) this.addRow();
  }

  showUnderlyingModal(entity?: any) {
    this.underlyingForm.reset();
    this.rows.clear();
    this.addRow();
    this.displayUnderlyingModal = true;
    this.displayUpdateChoiceModal = false;

  }

  // ---------- Grid / CRUD ----------
  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) this.dt.filter(input.value, 'global', 'contains');
  }

  getEntities() {
    this.featuresService.getAllEntities().subscribe({
      next: (data: any) => {
        this.entityList = Array.isArray(data.data) ? data.data : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        });
      }
    });
  }

  showModal() {
    this.isEditMode = false;
    this.entityForm.reset();
    this.displayModal = true;
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
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        });
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
      subcategory: entity.subcategory,
      isin: entity.isin
    });

    this.subCategoryOptions = this.allSubCategoryOptions[entity.category] || [];
    this.displayModal = true;
  }

  saveUpdatedEntity() {
    const updatedData = { id: this.selectedEntity.id, ...this.entityForm.value };
    this.featuresService.updateEntity(updatedData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Entity updated successfully' });
        this.resetForm();
        this.getEntities();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        });
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

  // ---------- Underlying ----------
  updateUnderlyingTable(entity: any) {
    this.selectedEntityId = entity.entityid;

    this.underlyingForm.reset();
    this.rows.clear();

    if (!this.selectedEntityId) {
      console.error('Entity ID is missing');
      return;
    }

    this.featuresService.getUnderlyingByEntityId(this.selectedEntityId!).subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach((row: any) => {
            this.rows.push(
              this.fb.group({
                company_name: [row.company_name || '', Validators.required],
                scripcode: [row.scripcode || '', Validators.required],
                sector: [row.sector || '', Validators.required],
                weightage: [row.weightage || '', Validators.required],
                tag: [row.tag || '', Validators.required],
                isin_code: [row.isin_code || '', Validators.required]
              })
            );
          });
        } else {
          this.addRow();
        }

        this.displayUnderlyingModal = true; // 
        this.displayUpdateChoiceModal = false;

      },
      error: (err) => {
        console.error('Error fetching underlying data', err);
        this.addRow();
        this.displayUnderlyingModal = true;
        this.displayUpdateChoiceModal = false;
      }
    });
  }

  submitUnderlyingData(): void {
    if (!this.selectedEntityId) return;

    if (this.underlyingForm.invalid) {
      this.underlyingForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.'
      });
      return;
    }

    const rowsValue = this.underlyingForm.value.rows || [];

    // check duplicates
    if (rowsValue.length > 0) {
      const companyNames = rowsValue.map((row: any) => row.company_name?.trim().toLowerCase());
      const hasDuplicate = companyNames.some(
        (name: string, idx: number) => companyNames.indexOf(name) !== idx
      );

      if (hasDuplicate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Duplicate Found',
          detail: 'Company names must be unique.'
        });
        return;
      }
    }

    const payload = { entityid: this.selectedEntityId, rows: rowsValue };

    this.isSubmitting = true; //  block multiple clicks + show modal

    this.featuresService.clearUnderlyingByEntityId(this.selectedEntityId).subscribe({
      next: () => {
        if (rowsValue.length === 0) {
          this.finishSubmission('Underlying data cleared successfully');
          return;
        }

        this.featuresService.addUnderlyingTable(payload).subscribe({
          next: () => {
            this.finishSubmission('Underlying data added successfully');
            this.underlyingForm.reset();
            this.underlyingForm.setControl('rows', this.fb.array([this.createRow()]));
          },
          error: () => this.isSubmitting = false
        });
      },
      error: () => this.isSubmitting = false
    });
  }

  private finishSubmission(successMessage: string) {
    this.displayUnderlyingModal = false;
    this.displayUpdateChoiceModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: successMessage
    });
    this.isSubmitting = false; // re-enable Save
  }



  onUpdate(entity: any) {
    this.selectedEntity = entity;
    this.displayUpdateChoiceModal = true;
  }

  // ---------- ACTION TABLE: open + patch (no double-click) ----------
  updateActionTable(entity: any) {
    this.displayUpdateChoiceModal = false;
    this.selectedEntity = entity;

    const ctx = this.getActionContext(entity);

    // Reset only the relevant form
    switch (ctx) {
      case 'DE':
        this.directEquityActionTableForm.reset();
        this.directEquityActionTableForm.patchValue({ entityid: entity.entityid });
        break;

      case 'AIF':
        this.aifActionTableForm.reset();
        this.aifActionTableForm.patchValue({ entityid: entity.entityid });
        break;

      case 'ETF':
        this.etfActionTableForm.reset();
        this.etfActionTableForm.patchValue({ entityid: entity.entityid });
        break;

      case 'MF':
      default:
        this.mfActionTableForm.reset();
        // Patch MF readonly defaults
        this.mfActionTableForm.patchValue({
          entityid: entity.entityid,
          scrip_code: entity.scripcode,
          scrip_name: entity.scripname,
          isin: entity.isin,
          order_date: new Date()
        });
        break;
    }

    // Open modal ONLY after reset/patch to avoid double-click
    this.displayActionTableModal = true;
    this.displayUpdateChoiceModal = false;
  }

  // In case you still use this elsewhere (kept safe)
  openActionTableDialog(entity: any) {
    this.updateActionTable(entity);
  }

  // ---------- Which fields & form to render ----------
  private getActionContext(entity: any): 'DE' | 'AIF' | 'ETF' | 'MF' | 'DECOM' {
    const cat = entity?.category;
    const sub = entity?.subcategory;
    if (cat === 'Equity' && sub === 'Direct Equity') return 'DE';
    if (cat === 'Equity' && sub === 'Alternative Investment Funds') return 'AIF';
    if (cat === 'Commodities' && sub === 'ETF') return 'ETF';
    if (cat === 'Commodities' && sub === 'Direct Equity') return 'DECOM';
    return 'MF';
  }

  get currentActionTableFields() {
    const ctx = this.getActionContext(this.selectedEntity);
    switch (ctx) {
      case 'DE': return this.directEquityActionTableFields;
      case 'DECOM': return this.directEquityActionTableFields;
      case 'AIF': return this.aifActionTableFields;
      case 'ETF': return this.etfActionTableFields;
      case 'MF':
      default: return this.mfActionTableFields;
    }
  }

  get currentActionTableForm() {
    const ctx = this.getActionContext(this.selectedEntity);
    let form: FormGroup;

    switch (ctx) {
      case 'DE': form = this.directEquityActionTableForm; break;
      case 'DECOM': form = this.directEquityActionTableForm; break;
      case 'AIF': form = this.aifActionTableForm; break;
      case 'ETF': form = this.etfActionTableForm; break;
      case 'MF':
      default: form = this.mfActionTableForm; break;
    }

    if (this.selectedEntity?.entityid) {
      form.get('entityid')?.setValue(this.selectedEntity.entityid, { emitEvent: false });
    }
    return form;
  }

  // ---------- Save handlers ----------
  saveCurrentActionTableData() {
    const ctx = this.getActionContext(this.selectedEntity);
    if (ctx === 'DE') return this.saveDirectEquityActionTableData();
    if (ctx === 'DECOM') return this.saveDirectEquityCommodityActionTableData()
    if (ctx === 'AIF') return this.saveAifActionTableData();
    if (ctx === 'ETF') return this.saveEtfActionTableData();
    return this.saveActionTableData(); // MF
  }

  saveActionTableData() {
    if (this.mfActionTableForm.invalid) return;

    const payload = this.mfActionTableForm.getRawValue();

    if (payload.order_date instanceof Date) {
      const d = payload.order_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.order_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Action table data added successfully' });
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

  saveDirectEquityActionTableData() {
    if (this.directEquityActionTableForm.invalid) return;

    const payload = this.directEquityActionTableForm.getRawValue();

    if (payload.trade_date instanceof Date) {
      const d = payload.trade_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.trade_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertDirectEquityActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Direct Equity data saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any } }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save Direct Equity data' });
      }
    });
  }

  saveDirectEquityCommodityActionTableData() {
    if (this.directEquityActionTableForm.invalid) return;

    const payload = this.directEquityActionTableForm.getRawValue();

    if (payload.trade_date instanceof Date) {
      const d = payload.trade_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.trade_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertDirectEquityCommodityActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Direct Equity data saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any } }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save Direct Equity data' });
      }
    });
  }

  saveEtfActionTableData() {
    if (this.etfActionTableForm.invalid) return;

    const payload = this.etfActionTableForm.getRawValue();

    if (payload.trade_date instanceof Date) {
      const d = payload.trade_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.trade_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertETFActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'ETF action table data saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any } }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save ETF data' });
      }
    });
  }

  saveAifActionTableData() {
    if (this.aifActionTableForm.invalid) return;

    const payload = this.aifActionTableForm.getRawValue();

    if (payload.trans_date instanceof Date) {
      const d = payload.trans_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.trans_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertAifActionTable(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'AIF action table data saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any } }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save AIF data' });
      }
    });
  }

  // ---------- NAV ----------
  openNavModal(entity: any) {
    this.selectedEntity = entity;
    this.displayUpdateChoiceModal = false;
    this.displayNavModal = true;
    this.navForm.reset();
    this.navForm.patchValue({ entityid: entity.entityid });
  }

  
  showAutoModal(){
    this.displayAutoModal = true
  }

  saveNavData() {
    if (this.navForm.invalid) return;

    const payload = this.navForm.getRawValue();

    if (payload.nav_date instanceof Date) {
      const d = payload.nav_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.nav_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertNavData(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'NAV data saved successfully' });
        this.displayNavModal = false;
        this.displayUpdateChoiceModal = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save NAV data' });
      }
    });
  }

  // ---------- Company search ----------
  searchCompany(event: any, rowIndex: number) {
    const query = event.query;
    if (query && query.length > 1) {
      this.featuresService.getCompanyByName(query).subscribe({
        next: (res: any) => {
          this.companySuggestions = res?.data ? res.data : [];
        },
        error: (err) => {
          console.error('Error fetching company list', err);
          this.companySuggestions = [];
        }
      });
    }
  }

  onCompanySelect(event: any, rowIndex: number) {
    const selectedCompany = event.value;
    const selectedName = selectedCompany.company_name?.trim().toLowerCase();

    const existing = this.rows.value.some(
      (row: any, idx: number) => idx !== rowIndex && row.company_name?.trim().toLowerCase() === selectedName
    );

    if (existing) {
      this.messageService.add({ severity: 'warn', summary: 'Duplicate', detail: 'This company is already added.' });
      this.rows.at(rowIndex).patchValue({ company_name: '', isin_code: '' });
      return;
    }

    this.rows.at(rowIndex).patchValue({
      company_name: selectedCompany.company_name,
      isin_code: selectedCompany.isin,
      tag: selectedCompany.tag,
      sector: selectedCompany.sector_name
    });
  }


  isReadOnlyField(key: string): boolean {
    return ['scrip_code', 'scrip_name', 'isin'].includes(key);
  }

  confirmDelete(entity: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${entity.scripname}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.featuresService.deleteEntity(entity.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Entity deleted successfully'
            });
            this.getEntities();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: error.error?.message || 'Delete failed'
            });
          }
        });
      },

      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete cancelled'
        });
      }
    });

  }


  onFileSelect(event: any) {
  const file = event.files && event.files[0];
  if (file) {
    this.automationForm.get('file')?.setValue(file, { emitEvent: false });
  }
}

onFileRemove(event: any) {
  this.automationForm.get('file')?.setValue(null, { emitEvent: false });
}

onUpload(event: any) {
  
}

saveAutomationData() {

  if (this.automationForm.invalid) {
    this.automationForm.markAllAsTouched();
    this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Please complete the form.' });
    return;
  }

  const payload = this.automationForm.value;

  // If file is a File object and you use FormData:
  const formData = new FormData();
  formData.append('category', payload.category);
  formData.append('subcategory', payload.subcategory);
  if (payload.file instanceof File) {
    formData.append('file', payload.file, payload.file.name);
  } else if (payload.file) {
    formData.append('fileId', payload.file);
  }

  this.featuresService.uploadAutomation(formData).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Automation saved successfully' });
      this.displayAutoModal = false;
      this.automationForm.reset();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Save failed' });
    }
  });
}

}
