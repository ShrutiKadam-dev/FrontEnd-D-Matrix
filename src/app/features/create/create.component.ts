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
    ToastModule
  ],
  providers: [ConfirmationService, MessageService], // ✅ ensure MessageService is provided
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  displayModal = false;
  entityForm: FormGroup;

  // Action table forms
  mfActionTableForm: FormGroup;
  directEquityActionTableForm: FormGroup;
  etfActionTableForm: FormGroup;
  aifActionTableForm: FormGroup;

  entityList: any[] = [];
  subCategoryOptions: any[] = [];
  isEditMode = false;
  displayUpdateChoiceModal = false;
  selectedEntity: any = null;

  // Underlying
  displayUnderlyingModal = false;
  underlyingForm!: FormGroup;
  selectedEntityId: string | null = null;

  // Contract note modal
  displayActionTableModal = false;

  // NAV
  displayNavModal = false;
  navForm: FormGroup;

  companySuggestions: any[] = [];
  date: Date | undefined = new Date();

  private confirmationService = inject(ConfirmationService);
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

  modeOptions = [{ label: 'Demat', value: 'Demat' }];

  allSubCategoryOptions: Record<string, any[]> = {
    Equity: [
      { label: 'Direct Equity', value: 'Direct Equity' },
      { label: 'Mutual Fund', value: 'Mutual Fund' },
      { label: 'Alternative Investment Funds', value: 'Alternative Investment Funds' },
      { label: 'ETF', value: 'ETF' },
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

  // ---------- Field definitions (render order matters) ----------
  etfActionTableFields = [
    { key: 'order_number', label: 'Order Number' },
    { key: 'order_time', label: 'Order Time' },
    { key: 'trade_number', label: 'Trade Number' },
    { key: 'trade_time', label: 'Trade Time' },
    { key: 'security_description', label: 'Security / Contract Description' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'gross_rate', label: 'Gross Rate / Trade price per unit' },
    { key: 'trade_price_per_unit', label: 'Trade price per unit' },
    { key: 'brokerage_per_unit', label: 'Brokerage per unit' },
    { key: 'net_rate_per_unit', label: 'Net rate per unit' },
    { key: 'closing_rate', label: 'Closing rate per unit (only for derivatives)' },
    { key: 'gst', label: 'GST' },
    { key: 'stt', label: 'STT' },
    { key: 'net_total_before_levies', label: 'Net Total before levies' },
    { key: 'remarks', label: 'Remarks' },
  ];

  mfActionTableFields = [
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
    const unit = Number(this.mfActionTableForm.get('unit')?.value) || 0;
    const nav = Number(this.mfActionTableForm.get('nav')?.value) || 0;
    const total = unit * nav;
    this.mfActionTableForm.get('purchase_value')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  constructor(private fb: FormBuilder) {
    // ---------- Entity form ----------
    this.entityForm = this.fb.group({
      scripname: ['', Validators.required],
      scripcode: ['', Validators.required],
      nickname: [''],
      benchmark: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      isin: ['', Validators.required],
    });

    // ---------- NAV ----------
    this.navForm = this.fb.group({
      pre_tax_nav: ['', Validators.required],
      post_tax_nav: ['', Validators.required],
      nav_date: ['', Validators.required],
      entityid: ['', Validators.required]
    });

    // ---------- AIF Action ----------
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

    // ---------- MF Action ----------
    this.mfActionTableForm = this.fb.group({
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
      entityid: ['', Validators.required]
    });

    // ---------- Direct Equity Action ----------
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
      entityid: ['', Validators.required]
    });

    // ---------- ETF Action ----------
    this.etfActionTableForm = this.fb.group({
      order_number: ['', Validators.required],
      order_time: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)]],
      trade_number: ['', Validators.required],
      trade_time: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)]],
      security_description: ['', Validators.required],
      order_type: ['', Validators.required],
      quantity: ['', Validators.required],
      gross_rate: ['', Validators.required],
      trade_price_per_unit: ['', Validators.required],
      brokerage_per_unit: ['', Validators.required],
      net_rate_per_unit: ['', Validators.required],
      closing_rate: ['', Validators.required],
      gst: ['', Validators.required],
      stt: ['', Validators.required],
      net_total_before_levies: ['', Validators.required],
      remarks: ['', Validators.required],
      entityid: ['', Validators.required]
    });

    // Auto-calc MF purchase_value
    this.mfActionTableForm.get('unit')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('nav')?.valueChanges.subscribe(() => this.calculatePurchaseValue());

    // Subcategory list by category
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

  // ---------- Underlying helpers ----------
  get rows(): FormArray {
    return this.underlyingForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      company_name: ['', Validators.required],
      scripcode: ['', Validators.required],
      sector: ['', Validators.required],
      weightage: ['', Validators.required],
      MCAP: ['', Validators.required],
      isin_code: ['', Validators.required]
    });
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
    if (this.rows.length === 0) this.addRow();
  }

  showUnderlyingModal(entity?: any) {
    this.underlyingForm.reset();
    this.rows.clear();
    this.addRow();
    this.displayUnderlyingModal = true;
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
                MCAP: [row.MCAP || '', Validators.required],
                isin_code: [row.isin_code || '', Validators.required]
              })
            );
          });
        } else {
          this.addRow();
        }

        this.displayUnderlyingModal = true; // ✅ open after patching
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
    if (this.underlyingForm.valid && this.selectedEntityId) {
      const companyNames = this.rows.value.map((row: any) => row.company_name?.trim().toLowerCase());
      const hasDuplicate = companyNames.some((name: string, idx: number) => companyNames.indexOf(name) !== idx);

      if (hasDuplicate) {
        this.messageService.add({ severity: 'error', summary: 'Duplicate Found', detail: 'Company names must be unique.' });
        return;
      }

      const payload = { entityid: this.selectedEntityId, rows: this.underlyingForm.value.rows };

      this.featuresService.clearUnderlyingByEntityId(this.selectedEntityId).subscribe({
        next: () => {
          this.featuresService.addUnderlyingTable(payload).subscribe({
            next: () => {
              this.displayUnderlyingModal = false;
              this.displayUpdateChoiceModal = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Underlying data added successfully' });
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

    // ✅ Open modal ONLY after reset/patch to avoid double-click
    this.displayActionTableModal = true;
  }

  // In case you still use this elsewhere (kept safe)
  openActionTableDialog(entity: any) {
    this.updateActionTable(entity);
  }

  // ---------- Which fields & form to render ----------
  private getActionContext(entity: any): 'DE' | 'AIF' | 'ETF' | 'MF' {
    const cat = entity?.category;
    const sub = entity?.subcategory;
    if (cat === 'Equity' && sub === 'Direct Equity') return 'DE';
    if (cat === 'Equity' && sub === 'Alternative Investment Funds') return 'AIF';
    if (cat === 'Equity' && sub === 'ETF') return 'ETF';
    return 'MF';
  }

  get currentActionTableFields() {
    const ctx = this.getActionContext(this.selectedEntity);
    switch (ctx) {
      case 'DE': return this.directEquityActionTableFields;
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

  saveEtfActionTableData() {
    if (this.etfActionTableForm.invalid) return;

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
    this.displayNavModal = true;
    this.navForm.reset();
    this.navForm.patchValue({ entityid: entity.entityid });
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
    const selectedName = selectedCompany.name_of_company?.trim().toLowerCase();

    const existing = this.rows.value.some(
      (row: any, idx: number) => idx !== rowIndex && row.company_name?.trim().toLowerCase() === selectedName
    );

    if (existing) {
      this.messageService.add({ severity: 'warn', summary: 'Duplicate', detail: 'This company is already added.' });
      this.rows.at(rowIndex).patchValue({ company_name: '', isin_code: '' });
      return;
    }

    this.rows.at(rowIndex).patchValue({
      company_name: selectedCompany.name_of_company,
      isin_code: selectedCompany.isin_number
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


}
