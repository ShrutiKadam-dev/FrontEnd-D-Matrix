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
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { FormArray } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePicker } from 'primeng/datepicker';
import { InputMask } from 'primeng/inputmask';

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
    InputMask
  ],
  providers: [ConfirmationService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  displayModal = false;
  entityForm: FormGroup;
  directEquityActionTableForm: FormGroup;
  aifActionTableForm: FormGroup;
  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  isEditMode = false;
  displayUpdateChoiceModal = false;
  selectedEntity: any = null;
  displayUnderlyingModal = false;
  underlyingForm!: FormGroup;
  displayActionTableModal = false;
  actionTableForm: FormGroup;
  selectedEntityId: string | null = null;
  companySuggestions: any[] = [];
  displayNavModal = false;
  navForm: FormGroup;
  date: Date | undefined = new Date();

  private confirmationService = inject(ConfirmationService)
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
    ],
    Fixed_Income: [
      { label: 'Direct Debt', value: 'Direct Debt' },
      { label: 'REIT', value: 'REIT' },
      { label: 'INVIT', value: 'INVIT' },
      { label: 'Mutual Fund', value: 'Mutual Fund' },
      { label: 'Alternative Investment Funds', value: 'Alternative Investment Funds' },
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

  directEquityActionTableFields = [
    { key: 'contract_note_number', label: 'Contract Note Number' },
    { key: 'trade_date', label: 'Trade Date' },
    { key: 'client_code', label: 'Client Code' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'order_number', label: 'Order Number' },
    { key: 'order_time', label: 'Order Time' },
    { key: 'trade_number', label: 'Trade Number' },
    { key: 'description', label: 'Description' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'qty', label: 'Quantity' },
    { key: 'trade_price', label: 'Trade Price' },
    { key: 'brokerage_per_unit', label: 'Brokerage / Unit' },
    { key: 'net_rate_per_unit', label: 'Net Rate / Unit' },
    { key: 'gst', label: 'GST' },
    { key: 'stt', label: 'STT' },
    { key: 'security_transaction_tax', label: 'Security Transaction Tax' },
    { key: 'exchange_transaction_charges', label: 'Exchange Transaction Charges' },
    { key: 'sebi_turnover_fees', label: 'SEBI Turnover Fees' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'ipft', label: 'IPFT' },
    { key: 'net_total', label: 'Net Total' },
    { key: 'net_amount_receivable', label: 'Net Amount Receivable' }
  ];

  aifActionTableFields = [
    { key: 'trans_date', label: 'Transaction Date' },
    { key: 'trans_type', label: 'Transaction Type' },
    { key: 'contribution_amount', label: 'Contribution Amount' },
    { key: 'setup_expense', label: 'Setup Expense' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'amount_invested', label: 'Amount Invested' },
    { key: 'post_tax_nav', label: 'Post-Tax Allotment/ Redemption NAV' },
    { key: 'num_units', label: 'Number of Units' },
    { key: 'balance_units', label: 'Balance Units' },
    { key: 'strategy_name', label: 'Strategy Name' },
    { key: 'amc_name', label: 'AMC Name' },
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

    this.navForm = this.fb.group({
      pre_tax_nav: ['', Validators.required],
      post_tax_nav: ['', Validators.required],
      nav_date: ['', Validators.required],
      entityid: ['', Validators.required]
    });

    this.aifActionTableForm = this.fb.group({
      trans_date: ['', Validators.required],
      trans_type: ['', Validators.required],
      contribution_amount: ['', Validators.required],
      setup_expense: [''],
      stamp_duty: [''],
      amount_invested: ['', Validators.required],
      post_tax_nav: [''],
      num_units: ['', Validators.required],
      balance_units: [''],
      strategy_name: [''],
      amc_name: [''],
      entityid: ['', Validators.required],
    });

    this.actionTableForm = this.fb.group({
      scrip_code: ['', Validators.required],
      mode: ['', Validators.required],
      order_type: ['', Validators.required],
      order_date: [new Date(), Validators.required],
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

    this.directEquityActionTableForm = this.fb.group({
      contract_note_number: ['', Validators.required],
      trade_date: ['', Validators.required],
      client_code: ['', Validators.required],
      client_name: ['', Validators.required],
      order_number: ['', Validators.required],
      order_time: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)]],
      trade_number: ['', Validators.required],
      description: [''],
      order_type: ['', Validators.required],
      qty: ['', Validators.required],
      trade_price: ['', Validators.required],
      brokerage_per_unit: ['', Validators.required],
      net_rate_per_unit: ['', Validators.required],
      gst: [''],
      stt: [''],
      security_transaction_tax: [''],
      exchange_transaction_charges: [''],
      sebi_turnover_fees: [''],
      stamp_duty: [''],
      ipft: [''],
      net_total: ['', Validators.required],
      net_amount_receivable: ['', Validators.required],
      entityid: ['', Validators.required] // link back to entity
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
  const rows = this.underlyingForm.value.rows;

  // Collect all company names
  const names = rows.map((row: any) => row.company_name?.trim().toLowerCase());

  // Check for duplicates
const hasDuplicate = names.some((name: string, idx: number) => 
  names.indexOf(name) !== idx
);

  if (hasDuplicate) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Duplicate',
      detail: 'Duplicate company name is not allowed'
    });
    return;
  }

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
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update failed'
        });
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

  updateUnderlyingTable(entity: any) {
    this.selectedEntityId = entity.entityid;

    // Reset form & rows
    this.underlyingForm.reset();
    this.rows.clear();

    if (!this.selectedEntityId) {
      console.error("Entity ID is missing");
      return;
    }
    // Fetch existing underlying data for this entity
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
                isin_code: [row.isin_code || '', Validators.required]
              })
            );
          });
        } else {
          // If no existing rows → add one empty row
          this.addRow();
        }

        this.displayUnderlyingModal = true; // open modal after patching
      },
      error: (err) => {
        console.error('Error fetching underlying data', err);
        // fallback → show dialog with one empty row
        this.addRow();
        this.displayUnderlyingModal = true;
        this.displayUpdateChoiceModal = false;

      }
    });
  }


  updateContractNoteTable() {
    this.displayUpdateChoiceModal = false;
  }

submitUnderlyingData(): void {
  if (this.underlyingForm.valid && this.selectedEntityId) {
    const companyNames = this.rows.value.map((row: any) =>
      row.company_name?.trim().toLowerCase()
    );

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

    const payload = {
      entityid: this.selectedEntityId,
      rows: this.underlyingForm.value.rows
    };

    // Your existing API call...
    this.featuresService.clearUnderlyingByEntityId(this.selectedEntityId).subscribe({
      next: () => {
        this.featuresService.addUnderlyingTable(payload).subscribe({
          next: () => {
            this.displayUnderlyingModal = false;
            this.displayUpdateChoiceModal = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Underlying data added successfully'
            });
            this.underlyingForm.reset();
            this.underlyingForm.setControl('rows', this.fb.array([this.createRow()]));
          }
        });
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
  this.displayUpdateChoiceModal = false;
  this.selectedEntity = entity;

  // Reset all action forms
  this.actionTableForm.reset();
  this.directEquityActionTableForm.reset();
  this.aifActionTableForm.reset();

  // Patch readonly defaults for normal table
  if (!(entity.category === 'Equity' && entity.subcategory === 'Direct Equity') &&
      !(entity.category === 'Equity' && entity.subcategory === 'Alternative Investment Funds')) {
    this.actionTableForm.patchValue({
      entityid: entity.entityid,
      scrip_code: entity.scripcode,
      scrip_name: entity.scripname,
      isin: entity.isin
    });
  }

  // Patch for Direct Equity
  if (entity.category === 'Equity' && entity.subcategory === 'Direct Equity') {
    this.directEquityActionTableForm.patchValue({
      entityid: entity.entityid
    });
  }

  // Patch for AIF
  if (entity.category === 'Equity' && entity.subcategory === 'Alternative Investment Funds') {
    this.aifActionTableForm.patchValue({
      entityid: entity.entityid
    });
  }

  this.displayActionTableModal = true;
}


  isReadOnlyField(key: string): boolean {
    return ['scrip_code', 'scrip_name', 'isin'].includes(key);
  }

  saveActionTableData() {
    if (this.actionTableForm.invalid) return;

    const payload = this.actionTableForm.getRawValue();


    if (payload.order_date instanceof Date) {
      const d = payload.order_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.order_date = `${yyyy}-${mm}-${dd}`;  // <-- send only date
    }

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
      error: (err: { error: { message: any; }; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save Direct Equity data' });
      }
    });
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

  searchCompany(event: any, rowIndex: number) {
    const query = event.query;

    if (query && query.length > 1) {  // call API only if length > 1
      this.featuresService.getCompanyByName(query).subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.companySuggestions = res.data; // API returns array
          } else {
            this.companySuggestions = [];
          }
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
  const selectedName = selectedCompany.name_of_company?.trim().toLowerCase();

  const existing = this.rows.value.some(
    (row: any, idx: number) => idx !== rowIndex && row.company_name?.trim().toLowerCase() === selectedName
  );

  if (existing) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Duplicate',
      detail: 'This company is already added.'
    });
    this.rows.at(rowIndex).patchValue({ company_name: '', isin_code: '' });
    return;
  }

  this.rows.at(rowIndex).patchValue({
    company_name: selectedCompany.name_of_company,
    isin_code: selectedCompany.isin_number
  });
}


  get currentActionTableFields() {
    if (this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Direct Equity') {
      return this.directEquityActionTableFields;
    }
    if (this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Alternative Investment Funds') {
      return this.aifActionTableFields;
    }
    return this.actionTableFields;
  }

get currentActionTableForm() {
  const form =
    this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Direct Equity'
      ? this.directEquityActionTableForm
      : this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Alternative Investment Funds'
      ? this.aifActionTableForm
      : this.actionTableForm;

  if (this.selectedEntity?.entityid) {
    form.get('entityid')?.setValue(this.selectedEntity.entityid, { emitEvent: false });
  }

  return form;
}

  saveCurrentActionTableData() {
    if (this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Direct Equity') {
      this.saveDirectEquityActionTableData();
    } else if (this.selectedEntity?.category === 'Equity' && this.selectedEntity?.subcategory === 'Alternative Investment Funds') {
      this.saveAifActionTableData();
    } else {
      this.saveActionTableData();
    }
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'AIF action table data saved successfully'
        });
        this.displayActionTableModal = false;
      },
      error: (err: { error: { message: any; }; }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to save AIF data'
        });
      }
    });
  }

openActionTableDialog(entity: any) {
  this.selectedEntity = entity;
  this.displayActionTableModal = true;

  // Pick the correct form
  const form = this.currentActionTableForm;

  // Patch entityid (and any defaults)
  form.patchValue({
    entityid: this.selectedEntity?.entityid || ''
  });
}

 openNavModal(entity: any) {
    this.selectedEntity = entity;
    this.displayNavModal = true;

    this.navForm.reset();
    this.navForm.patchValue({
      entityid: entity.entityid
    });
  }

  saveNavData() {
    if (this.navForm.invalid) return;

    const payload = this.navForm.getRawValue();

    // Format date
    if (payload.nav_date instanceof Date) {
      const d = payload.nav_date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      payload.nav_date = `${yyyy}-${mm}-${dd}`;
    }

    this.featuresService.insertNavData(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'NAV data saved successfully'
        });
        this.displayNavModal = false;
        this.displayUpdateChoiceModal = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to save NAV data'
        });
      }
    });
  }
}



