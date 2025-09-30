import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { FeaturesService } from '../../../features.service';
import { SpeedDial } from 'primeng/speeddial';
import { FormConfig } from '../../../form-config';
import { ActionTableField, MF_ACTION_TABLE_FIELDS } from '../../../form-fields.enums';
import { MODE_OPTIONS, ORDER_TYPE_OPTIONS } from '../../../dropdown-options.enums';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mutual-fund-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    SpeedDial,
    MessagesModule,
    ConfirmDialogModule,
    TableModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule,
    DatePickerModule,
    ChartModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mutual-fund-details.component.html',
  styleUrls: ['./mutual-fund-details.component.scss']
})
export class MutualFundDetailsComponent implements OnInit {
  mfId!: string | null;
  mfDetails: any;

  // ---- Chart Data
  chartData: any = { labels: [], datasets: [] };
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  // ---- Tables & Lists
  actionTableList: any[] = [];
  underlyingTableList: any[] = [];
  mcapTableList: any[] = [];
  sectorTableList: any[] = [];

  // ---- Counts
  actionCounts: any = {};
  sectorCounts: any = {};

  // ---- Totals
  totalPurchaseUnits = 0;
  totalPurchaseAmount = 0;
  totalSalesUnits = 0;
  totalSalesAmount = 0;
  availableUnits = 0;
  availableAmount = 0;
  totalValue = 0;

  // ---- Results
  irrResult: number | null = null;

  // ---- States
  isLoading = false;
  errorMessage: string | null = null;
  selectedDate = '';
  allNavs: any;

  // ---- Chart configs
  mcapChartData: any;
  mcapChartOptions: any;
  sectorChartData: any;
  sectorChartOptions: any;

  displayEditDialog = false;
  mfActionTableForm: FormGroup;
  editingRow: any = null;
  mfActionTableFields = MF_ACTION_TABLE_FIELDS;
  currentActionTableFields: ActionTableField[] = MF_ACTION_TABLE_FIELDS;
  orderTypeOptions = ORDER_TYPE_OPTIONS;
  modeOptions = MODE_OPTIONS;


  // ---- Table refs
  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('actionTableTransactions') actionTableTransactions!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  constructor(private fb: FormBuilder, private location: Location) {
    const formConfig = new FormConfig(this.fb);
    this.mfActionTableForm = formConfig.mfActionTableForm();

    this.mfActionTableForm.get('unit')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('nav')?.valueChanges.subscribe(() => this.calculatePurchaseValue());
    this.mfActionTableForm.get('purchase_amount')?.valueChanges.subscribe(() => this.calculatePurchaseValue());

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

  }

  ngOnInit() {
    this.mfId = this.route.snapshot.paramMap.get('id');

    if (this.mfId) {
      this.loadMfDetails(this.mfId);
      this.getMFDetailActionTable(this.mfId);
      this.getMFDetailUnderlyingTable(this.mfId);
      this.getAllMFDetailsEquitySectorCount(this.mfId);
      this.getallMfDetailsEquityMCAPCount(this.mfId);
      this.fetchIrr(this.mfId);
    }
  }

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

  isReadOnlyField(key: string): boolean {
    return ['entityid'].includes(key);
  }

  getRowActions(entity: any) {
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.onEditRow(entity)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.onDeleteRow(entity)
      }
    ];
  }

  goBack(){
    this.location.back();
  }

  onEditRow(entity: any) {
    this.editingRow = entity;

    // Clone entity to avoid mutation
    const patchData = { ...entity };

    // Convert order_date string to Date object
    if (patchData.order_date) {
      const parts = patchData.order_date.split('-'); // ["08","09","2025"]
      patchData.order_date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }

    this.mfActionTableForm.patchValue(patchData);
    this.displayEditDialog = true;
  }

  saveEdit() {
    if (this.mfActionTableForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill required fields correctly' });
      return;
    }

    const updatedData = this.mfActionTableForm.getRawValue(); // includes disabled fields

    if (updatedData.order_date instanceof Date) {
      const d = updatedData.order_date;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      updatedData.order_date = `${day}-${month}-${year}`;
    }

    this.featuresService.updateMFDetailActionTableRow(this.editingRow.id, updatedData).subscribe({
      next: () => {
        Object.assign(this.editingRow, updatedData);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Order No ${this.editingRow.order_number} updated successfully` });
        this.displayEditDialog = false;
        this.calculateTotals(this.actionTableList);
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Failed', detail: err.error?.message || 'Update failed' })
    });
  }

  onDeleteRow(entity: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Order No: "${entity.order_number}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.featuresService.deleteMFDetailActionTableRow(entity.id).subscribe({
          next: () => {
            this.actionTableList = this.actionTableList.filter(row => row.id !== entity.id);

            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `Order No ${entity.order_number} deleted`
            });

            this.calculateTotals(this.actionTableList);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: err.error?.message || 'Delete failed'
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

  // ---------------- Action Table ----------------
  calculateTotals(actionTableList: any[]) {
    if (!Array.isArray(actionTableList) || actionTableList.length === 0) {
      this.totalPurchaseUnits = this.totalPurchaseAmount = 0;
      this.totalSalesUnits = this.totalSalesAmount = 0;
      this.availableUnits = this.availableAmount = 0;
      return;
    }

    this.totalPurchaseUnits = this.totalPurchaseAmount = 0;
    this.totalSalesUnits = this.totalSalesAmount = 0;

    actionTableList.forEach(action => {
      const units = Number(action.unit) || 0;
      const amount = Number(action.purchase_amount) || 0;

      if ((action.order_type || '').toString().trim().toUpperCase() === 'PURCHASE') {
        this.totalPurchaseUnits += units;
        this.totalPurchaseAmount += amount;
      } else if ((action.order_type || '').toString().trim().toUpperCase() === 'SELL') {
        this.totalSalesUnits += units;
        this.totalSalesAmount += amount;
      }
    });

    this.availableUnits = this.totalPurchaseUnits - this.totalSalesUnits;
    this.availableAmount = this.totalPurchaseAmount - this.totalSalesAmount;
  }

  onGlobalFilter(event: Event, tableType: 'action' | 'underlying') {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      if (tableType === 'action' && this.actionTableSummary) {
        this.actionTableSummary.filterGlobal(input.value, 'contains');
      } else if (tableType === 'underlying' && this.underlyingTable) {
        this.underlyingTable.filterGlobal(input.value, 'contains');
      }
    }
  }

  // ---------------- APIs ----------------
  loadMfDetails(id: string) {
    this.featuresService.getMutualFundDetailsById(id).subscribe({
      next: (res: any) => {
        this.mfDetails = res?.data || {};
        const isin = Array.isArray(this.mfDetails) && this.mfDetails[0]?.isin
          ? this.mfDetails[0].isin
          : (this.mfDetails?.isin ?? null);
        if (isin) this.getAllMutualFundDetailsNav(isin);
      },
      error: (err: any) => console.error('Failed to load Mutual Fund details', err)
    });
  }

  getMFDetailActionTable(mfId: string) {
    this.featuresService.getMFDetailActionTable(mfId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
        this.calculateTotals(this.actionTableList);
      },
      error: (error) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load actions'
        })
    });
  }

  getAllMutualFundDetailsNav(ISIN: string) {
    this.featuresService.getAllMutualFundDetailsNav(ISIN).subscribe({
      next: (data: any) => {
        this.allNavs = Array.isArray(data.data) ? data.data : [];
        const navValue = this.allNavs?.[0]?.nav;
        this.totalValue = Number.isFinite(navValue) ? navValue * this.availableUnits : 0;
      },
      error: (error) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update for Nav value failed'
        })
    });
  }

  getMFDetailUnderlyingTable(mfId: string) {
    this.featuresService.getMFDetailUnderlyingTable(mfId).subscribe({
      next: (data) => {
        this.underlyingTableList = Array.isArray(data.data) ? data.data : [];
        this.selectedDate = this.underlyingTableList[0]?.created_at?.split('T')[0] || '';
      },
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: err.error?.message || 'Failed to load Mutual Fund underlying table'
        })
    });
  }

  getallMfDetailsEquityMCAPCount(mfId: string) {
    this.featuresService.getallMfDetailsEquityMCAPCount(mfId).subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.mcapTableList = [];
          this.mcapChartData = null;
          this.actionCounts = {};
          return;
        }

        this.mcapTableList = res.data.map((s: any, i: number) => ({
          ...s,
          color: `hsl(${(i * 360) / res.data.length}, 70%, 50%)`
        }));

        const totalCount = res.data[0]?.total_tag_count || 0;
        this.actionCounts = { total_count: totalCount };

        this.mcapTableList.forEach((tagData: any) => {
          const key = tagData.tag.toLowerCase().replace(/\s+/g, '_');
          this.actionCounts[`${key}_percent`] = tagData.tag_percent || 0;
          this.actionCounts[`${key}_count`] = tagData.tag_count || 0;
        });

        this.mcapChartData = {
          labels: this.mcapTableList.map((d: any) => d.tag),
          datasets: [{
            data: this.mcapTableList.map((d: any) => d.tag_percent),
            backgroundColor: this.mcapTableList.map((s: any) => s.color),
            hoverBackgroundColor: this.mcapTableList.map((s: any) => s.color)
          }]
        };

        this.mcapChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw?.toFixed(1) || 0}%`
              }
            }
          }
        };
      },
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: err.error?.message || 'Failed to load Mutual Fund MCAP chart'
        })
    });
  }

  getAllMFDetailsEquitySectorCount(mfId: string) {
    this.featuresService.getallMfDetailsEquitySectorCount(mfId).subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.sectorTableList = [];
          this.sectorChartData = null;
          this.sectorCounts = {};
          return;
        }

        this.sectorTableList = res.data.map((s: any, i: number) => ({
          ...s,
          color: `hsl(${(i * 360) / res.data.length}, 65%, 55%)`
        }));

        const totalCount = res.data[0]?.total_sector_count || 0;
        this.sectorCounts = { total_count: totalCount };

        this.sectorChartData = {
          labels: this.sectorTableList.map((s: any) => s.sector),
          datasets: [{
            data: this.sectorTableList.map((s: any) => s.sector_percent),
            backgroundColor: this.sectorTableList.map((s: any) => s.color),
            hoverBackgroundColor: this.sectorTableList.map((s: any) => s.color)
          }]
        };

        this.sectorChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const value = typeof context.raw === 'number' ? context.raw : 0;
                  return `${context.label}: ${value.toFixed(1)}%`;
                }
              }
            }
          }
        };
      },
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: err.error?.message || 'Failed to load Mutual Fund sector chart'
        })
    });
  }

  // ---------------- IRR ----------------
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getIrrById(entityid).subscribe({
      next: (response) => {
        this.irrResult = response?.annualized_irr_percent ?? null;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch IRR';
        this.isLoading = false;
      }
    });
  }

  getSeverity(orderType: string) {
    switch ((orderType || '').toString().trim().toUpperCase()) {
      case 'PURCHASE':
        return 'success';
      case 'SELL':
        return 'danger';
      default:
        return 'info';
    }
  }

  
}
