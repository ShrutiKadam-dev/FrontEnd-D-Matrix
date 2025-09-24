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
  AIF_ACTION_TABLE_FIELDS,
  PMS_AMC_ACTION_TABLE_FIELDS,
  PMS_CLIENT_ACTION_TABLE_FIELDS
} from '../form-fields.enums';
import {
  CATEGORY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PMS_ORDER_TYPE_OPTIONS,
  MODE_OPTIONS,
  ALL_SUBCATEGORY_OPTIONS,
  SUB_AIF_CATEGORY_OPTIONS
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
  navFormAIF: FormGroup;
  navFormMF: FormGroup;
  underlyingForm!: FormGroup;
  automationForm: FormGroup;
  // Action table forms
  mfActionTableForm: FormGroup;
  directEquityActionTableForm: FormGroup;
  etfActionTableForm: FormGroup;
  aifActionTableForm: FormGroup;
  pmsClientActionForm: FormGroup;
  pmsAmcForm: FormGroup;
  searchForm!: FormGroup;

  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  automationSubCategoryOptions: any[] = [];
  isEditMode = false;
  displayUpdateChoiceModal = false;
  selectedEntity: any = null;
  loading: boolean = false;

  // Underlying
  displayUnderlyingModal = false;
  selectedEntityId: string | null = null;
  isSubmitting: boolean = false;

  // Contract note modal
  displayActionTableModal = false;

  // NAV
  displayNavModal = false;

  //automation
  pdfIsSubmitting = false

  //PMS
  isPmsMode: 'CLIENT' | 'AMC' | null = null;

  openPmsClientAction(entity: any) {
    this.selectedEntity = entity;
    this.isPmsMode = 'CLIENT';
    this.displayActionTableModal = true;
    this.displayUpdateChoiceModal = false;

    this.pmsClientActionForm.reset();
    this.pmsClientActionForm.patchValue({ entityid: entity.entityid });
  }

  openPmsAmcAction(entity: any) {
    this.selectedEntity = entity;
    this.isPmsMode = 'AMC';
    this.displayActionTableModal = true;
    this.displayUpdateChoiceModal = false;
    this.pmsAmcForm.reset();
    this.pmsAmcForm.patchValue({ entityid: entity.entityid });
  }

  companySuggestions: any[] = [];
  date: Date | undefined = new Date();

  mfActionTableFields = MF_ACTION_TABLE_FIELDS;
  directEquityActionTableFields = DIRECT_EQUITY_ACTION_TABLE_FIELDS;
  etfActionTableFields = ETF_ACTION_TABLE_FIELDS;
  aifActionTableFields = AIF_ACTION_TABLE_FIELDS;
  pmsClientActionTableFields = PMS_CLIENT_ACTION_TABLE_FIELDS;
  pmsAmcActionTableFields = PMS_AMC_ACTION_TABLE_FIELDS;

  private confirmationService = inject(ConfirmationService);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  categoryOptions = CATEGORY_OPTIONS;
  orderTypeOptions = ORDER_TYPE_OPTIONS;
  PmsOrderTypeOptions = PMS_ORDER_TYPE_OPTIONS;
  modeOptions = MODE_OPTIONS;
  allSubCategoryOptions = ALL_SUBCATEGORY_OPTIONS;
  subAIFCategoryOptions = SUB_AIF_CATEGORY_OPTIONS;

  private calculatePurchaseValue(): void {
    const orderType = this.mfActionTableForm.get('order_type')?.value;

    //Skip calculation for Sell
    if (orderType === 'Sell') {
      return;
    }

    const unit = Number(this.mfActionTableForm.get('unit')?.value) || 0;
    const nav = Number(this.mfActionTableForm.get('nav')?.value) || 0;
    const total = unit * nav;
    this.mfActionTableForm.get('purchase_value')?.setValue(total.toFixed(2), { emitEvent: false });

    const netTotal = Number(this.mfActionTableForm.get('purchase_amount')?.value) || 0;
    this.mfActionTableForm.get('net_amount')?.setValue(netTotal.toFixed(2), { emitEvent: false });

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
    this.navFormAIF = formConfig.navFormAIF();
    this.navFormMF = formConfig.navFormMF();
    this.automationForm = formConfig.automationForm();
    this.aifActionTableForm = formConfig.aifActionTableForm();
    this.pmsClientActionForm = formConfig.pmsClientActionForm();
    this.pmsAmcForm = formConfig.pmsAmcForm();
    this.mfActionTableForm = formConfig.mfActionTableForm();
    this.directEquityActionTableForm = formConfig.directEquityActionTableForm();
    this.etfActionTableForm = formConfig.etfActionTableForm();

    // Auto-calc MF purchase_value
    this.mfActionTableForm.get('unit')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('nav')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('purchase_amount')?.valueChanges.subscribe(() => this.calculatePurchaseValue());

    this.directEquityActionTableForm.get('qty')?.valueChanges.subscribe(() => this.calculateNetTotalValue());
    this.directEquityActionTableForm.get('trade_price')?.valueChanges.subscribe(() => this.calculateNetTotalValue());

    // Subcategory list by category
    this.entityForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.subCategoryOptions = this.allSubCategoryOptions[selectedCategory] || [];
      this.entityForm.get('subcategory')?.reset();
    });

    // Subcategory list by category
    this.automationForm.get('category')?.valueChanges.subscribe(selectedCategory => {
      this.automationSubCategoryOptions = this.allSubCategoryOptions[selectedCategory] || [];
      this.automationForm.get('subcategory')?.reset();
    });

    this.entityForm.valueChanges.subscribe(val => {
      const category = val.category;
      const subcategory = val.subcategory;

      if (category === 'Equity' && subcategory === 'PMS') {
        this.entityForm.get('isin')?.disable({ emitEvent: false });
      } else {
        this.entityForm.get('isin')?.enable({ emitEvent: false });
      }
    });


  }

  ngOnInit() {
    this.getEntities();

    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.searchForm.get('searchText')?.valueChanges.subscribe(value => {
      this.dt.filterGlobal(value, 'contains');
    });

    this.underlyingForm = this.fb.group({
      rows: this.fb.array([this.createRow()])
    });

    this.entityForm.get('subcategory')?.valueChanges.subscribe(sub => {
      const category = this.entityForm.get('category')?.value;

      if (category === 'Equity' && sub === 'Alternative Investment Funds') {
        this.entityForm.get('aifCategory')?.enable();
        this.entityForm.get('aifClass')?.enable();
      } else {
        this.entityForm.get('aifCategory')?.disable();
        this.entityForm.get('aifClass')?.disable();
        this.entityForm.patchValue({ aifCategory: '', aifClass: '' });
      }
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
      isin_code: ['', Validators.required],
      fromApi: [false]
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
    this.loading = true;

    this.featuresService.getAllEntities().subscribe({
      next: (data: any) => {
        this.entityList = Array.isArray(data.data) ? data.data : [];
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        });
        this.loading = false;
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
                isin_code: [row.isin_code || '', Validators.required],
                fromApi: [true]
              })
            );
          });
        } else {
          this.addRow();
        }

        this.displayUnderlyingModal = true;
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
        this.etfActionTableForm.patchValue({
          entityid: entity.entityid,
          security_description: entity.scripname
        });
        break;

      case 'MF':
        this.mfActionTableForm.reset();
        // Patch MF readonly defaults
        this.mfActionTableForm.patchValue({
          entityid: entity.entityid,
          scrip_code: entity.scripcode,
          scrip_name: entity.scripname,
          isin: entity.isin,
        });

        this.mfActionTableForm.get('order_type')?.valueChanges.subscribe((val: string) => {
          if (val === 'Purchase') {
            this.mfActionTableForm.get('redeem_amount')?.disable({ emitEvent: false });
          }
          else if (val === 'Sell') {
            this.mfActionTableForm.get('purchase_amount')?.disable({ emitEvent: false });
            this.mfActionTableForm.get('purchase_value')?.disable({ emitEvent: false });
            this.mfActionTableForm.get('redeem_amount')?.enable({ emitEvent: false });
          }
          else {
            this.mfActionTableForm.get('redeem_amount')?.enable({ emitEvent: false });
            this.mfActionTableForm.get('purchase_amount')?.enable({ emitEvent: false });
            this.mfActionTableForm.get('purchase_value')?.enable({ emitEvent: false });
          }
        });

        break;
      default:
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
  getActionContext(entity: any): 'DE' | 'AIF' | 'ETF' | 'MF' | 'DECOM' | 'PMS_CLIENT' | 'PMS_AMC' {
    const cat = entity?.category;
    const sub = entity?.subcategory;

    if (cat === 'Equity' && sub === 'Direct Equity') return 'DE';
    if (cat === 'Equity' && sub === 'Alternative Investment Funds') return 'AIF';
    if (cat === 'Commodities' && sub === 'ETF' || cat === 'Equity' && sub === 'ETF' || cat === 'Fixed_Income' && sub === 'ETF') return 'ETF';
    if (cat === 'Commodities' && sub === 'Direct Equity') return 'DECOM';
    if (sub === 'PMS' && this.isPmsMode === 'CLIENT') return 'PMS_CLIENT';
    if (sub === 'PMS' && this.isPmsMode === 'AMC') return 'PMS_AMC';

    return 'MF';
  }

  get currentActionTableFields() {
    const ctx = this.getActionContext(this.selectedEntity);
    switch (ctx) {
      case 'DE': return this.directEquityActionTableFields;
      case 'DECOM': return this.directEquityActionTableFields;
      case 'AIF': return this.aifActionTableFields;
      case 'ETF': return this.etfActionTableFields;
      case 'PMS_CLIENT': return this.pmsClientActionTableFields;
      case 'PMS_AMC': return this.pmsAmcActionTableFields;
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
      case 'PMS_CLIENT': form = this.pmsClientActionForm; break;
      case 'PMS_AMC': form = this.pmsAmcForm; break;
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
    if (ctx === 'PMS_CLIENT') return this.savePmsClientActionTableData();
    if (ctx === 'PMS_AMC') return this.savePmsAmcActionTableData();

    return this.saveActionTableData(); // MF
  }

  saveActionTableData() {
    if (this.mfActionTableForm.invalid) return;

    this.formatDateField(this.mfActionTableForm, 'order_date');

    const payload = this.mfActionTableForm.getRawValue();


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

    this.formatDateField(this.directEquityActionTableForm, 'trade_date');

    const payload = this.directEquityActionTableForm.getRawValue();

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
    this.formatDateField(this.directEquityActionTableForm, 'trade_date');

    const payload = this.directEquityActionTableForm.getRawValue();

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
    this.formatDateField(this.etfActionTableForm, 'trade_date');

    const payload = this.etfActionTableForm.getRawValue();

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

  private formatDateField(form: FormGroup, field: string) {
    const val = form.get(field)?.value;
    if (val) {
      const date = new Date(val);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

      const yyyy = localDate.getFullYear();
      const mm = String(localDate.getMonth() + 1).padStart(2, '0');
      const dd = String(localDate.getDate()).padStart(2, '0');

      form.get(field)?.setValue(`${yyyy}-${mm}-${dd}`, { emitEvent: false });
    }
  }

  saveAifActionTableData() {
    if (this.aifActionTableForm.invalid) return;
    this.formatDateField(this.aifActionTableForm, 'trans_date');

    const payload = this.aifActionTableForm.getRawValue();

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

  savePmsClientActionTableData() {
    if (this.currentActionTableForm.invalid) return;
    this.formatDateField(this.currentActionTableForm, 'trade_date');

    const payload = this.currentActionTableForm.getRawValue();
    // Format PMS-specific fields if needed

    this.featuresService.insertPmsClientAction(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'PMS Client action saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any; }; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save PMS Client action' });
      }
    });
  }

  savePmsAmcActionTableData() {
    if (this.currentActionTableForm.invalid) return;
    this.formatDateField(this.currentActionTableForm, 'trans_date');

    const payload = this.currentActionTableForm.getRawValue();

    this.featuresService.insertPmsAmcAction(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'PMS AMC action saved successfully' });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any; }; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save PMS AMC action' });
      }
    });
  }

  // ---------- NAV ----------
  openNavModal(entity: any) {
    this.selectedEntity = entity;
    this.displayUpdateChoiceModal = false;

    if (entity.category === 'Equity' && entity.subcategory === 'Alternative Investment Funds') {
      this.navFormAIF.reset();
      this.navFormAIF.patchValue({ entityid: entity.entityid });
      this.displayNavModal = true;
    } else if (entity.category === 'Equity' && entity.subcategory === 'Mutual Fund') {
      this.navFormMF.reset();
      this.navFormMF.patchValue({ entityid: entity.entityid });
      this.displayNavModal = true;
    }
  }

  showAutoModal() {
    this.displayAutoModal = true
  }

  saveNavData() {
    if (!this.selectedEntity) return;

    let navForm: FormGroup;
    let serviceCall: any;

    // Choose the correct form and service based on subcategory
    if (this.selectedEntity.subcategory === 'Alternative Investment Funds') {
      this.formatDateField(this.navFormAIF, 'nav_date');
      navForm = this.navFormAIF;

      serviceCall = this.featuresService.insertaifnavData(navForm.getRawValue());
    } else if (this.selectedEntity.subcategory === 'Mutual Fund') {
      this.formatDateField(this.navFormMF, 'nav_date');
      navForm = this.navFormMF;

      serviceCall = this.featuresService.insertmfnavData(navForm.getRawValue());
    } else {
      // Unknown subcategory
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unknown NAV type'
      });
      return;
    }
    // Validate the form
    if (navForm.invalid) {
      navForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.'
      });
      return;
    }

    // Format nav_date if present
    const payload = navForm.getRawValue();
    if (payload.nav_date instanceof Date) {
      const d = payload.nav_date;
      payload.nav_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // Call the backend service
    serviceCall.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'NAV data saved successfully'
        });
        this.displayNavModal = false;
        this.displayUpdateChoiceModal = false;
      },
      error: (err: { error: { message: any; }; }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to save NAV data'
        });
      }
    });
  }

  clearSearch() {
    this.searchForm.get('searchText')?.setValue('');
    this.dt.clear(); // clears filters in PrimeNG table
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

  saveAutomationData() {

    this.pdfIsSubmitting = true

    if (this.automationForm.invalid) {
      this.automationForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Please complete the form.' });
      return;
    }

    const payload = this.automationForm.value;
    const formData = new FormData();

    // Append category & subcategory
    formData.append('category', payload.category);
    formData.append('subcategory', payload.subcategory);

    if (payload.file instanceof File) {
      formData.append('files', payload.file, payload.file.name);
    } else if (Array.isArray(payload.file) && payload.file.length > 0) {
      formData.append('files', payload.file[0], payload.file[0].name);
    }


    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    this.featuresService.uploadAutomation(formData).subscribe({
      next: (res: any) => {
        // Build message from API response
        const inserted = res?.summary?.inserted_count || 0;
        const skipped = res?.summary?.skipped_count || 0;
        const total = res?.summary?.total_processed || 0;

        this.messageService.add({ severity: 'success', summary: 'Upload Completed', detail: `Inserted: ${inserted}, Skipped: ${skipped}` })
        // Optional: if you want to show details of skipped items
        if (res?.skipped?.length) {
          res.skipped.forEach((item: any) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Skipped',
              detail: `Order #${item.order_number} → ${item.status}`
            });
          });
        }
        this.displayAutoModal = false;
        this.automationForm.reset();
        this.getEntities()
        this.pdfIsSubmitting = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Save failed' });
        this.pdfIsSubmitting = false
      }
    });
  }

}
