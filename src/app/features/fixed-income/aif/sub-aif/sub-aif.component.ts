import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { FeaturesService } from '../../../features.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { FormConfig } from '../../../form-config';
import { SpeedDial } from 'primeng/speeddial';
import { ActionTableField, AIF_ACTION_TABLE_FIELDS } from '../../../form-fields.enums';
import { DatePickerModule } from 'primeng/datepicker';
import { PMS_ORDER_TYPE_OPTIONS } from '../../../dropdown-options.enums';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
@Component({
  selector: 'app-sub-aif',
  imports: [
    InputTextModule,
    TagModule,
    ConfirmDialog,
    FormsModule,
    SpeedDial,
    AutoCompleteModule,
    DropdownModule,
    CarouselModule,
    TableModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule,
    CardModule,
    ChartModule,
    ButtonModule,
    CommonModule,
    DatePickerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sub-aif.component.html',
  styleUrl: './sub-aif.component.scss'
})
export class SubAifComponent implements OnInit {

  aifId!: string | null;
  underlyingList: any[] = [];
  irrResult: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  totalPurchaseUnits = 0;
  totalPurchaseAmount = 0;
  totalSalesUnits = 0;
  totalSalesAmount = 0;
  availableUnits = 0;
  availableAmount = 0;

  aifDetails: any;

  // ---- Chart configs
  mcapChartData: any;
  mcapChartOptions: any;
  sectorChartData: any;
  sectorChartOptions: any;

  mcapTableList: any[] = [];
  sectorTableList: any[] = [];

  // ---- Counts
  actionCounts: any = {};
  sectorCounts: any = {};

  totalValue = 0;

  editingRow: any = null;
  displayActionRowEditDialog = false;
  actionTableList: any[] = [];
  aifActionTableForm: FormGroup;
  currentActionTableFields: ActionTableField[] = AIF_ACTION_TABLE_FIELDS;
  PmsOrderTypeOptions = PMS_ORDER_TYPE_OPTIONS;

  // ---- Table refs
  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private featuresService = inject(FeaturesService);


  constructor(private route: ActivatedRoute, private location: Location, private fb: FormBuilder) {

    const formConfig = new FormConfig(this.fb);
    this.aifActionTableForm = formConfig.aifActionTableForm();

  }

  ngOnInit(): void {
    this.aifId = this.route.snapshot.paramMap.get('id');
    if (this.aifId) {
      this.loadAIFDetails(this.aifId);
      this.getAifActionTableById(this.aifId);
      this.getAifDetailsFixedIncomeUnderlyingTable(this.aifId);
      this.getAIFDetailsFixedIncomeSectorCount(this.aifId);
      this.getAIFDetailsFixedIncomeMCAPCount(this.aifId);
      this.fetchIrr(this.aifId);
    }

  }

  goBack() {
    this.location.back();
  }

  getAifActionTableById(aifId: string) {
    console.log(aifId);

    this.featuresService.getAifActionTableById(aifId).subscribe({
      next: (res: any) => {
        this.actionTableList = res?.data || [];
        this.calculateTotals(this.actionTableList)
        console.log(this.actionTableList);
      },
      error: () => console.error('Failed to fetch AIF Action Table')
    })
  }

  getAifDetailsFixedIncomeUnderlyingTable(aifId: string) {
    this.featuresService.getAifDetailsFixedIncomeUnderlyingTable(aifId).subscribe({
      next: (res: any) => {
        this.underlyingList = res?.data || [];

      },
      error: () => console.error('Failed to fetch AIF Action Table')
    })

  }

  loadAIFDetails(id: string) {
    this.featuresService.getEntityById(id).subscribe({
      next: (res: any) => {
        this.aifDetails = res?.data || {};
        // const isin = Array.isArray(this.aifDetails) && this.aifDetails[0]?.isin
        //   ? this.aifDetails[0].isin
        //   : (this.aifDetails?.isin ?? null);
        // if (isin) this.getAllMutualFundDetailsNav(isin);
      },
      error: (err: any) => console.error('Failed to load AIF details', err)
    });
  }

  // Function to fetch IRR
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getAifIrrById(entityid).subscribe({
      next: (response) => {
        this.irrResult = response?.annualized_irr_percent ?? null;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching IRR:', err);
        this.errorMessage = 'Failed to fetch IRR';
        this.isLoading = false;
      }
    });
  }

  calculateTotals(actionTableList: any[]) {
    if (!actionTableList || actionTableList.length === 0) {
      this.totalPurchaseUnits = 0;
      this.totalPurchaseAmount = 0;
      this.totalSalesUnits = 0;
      this.totalSalesAmount = 0;
      this.availableUnits = 0;
      this.availableAmount = 0;
      return;
    }

    // Reset totals
    this.totalPurchaseUnits = 0;
    this.totalPurchaseAmount = 0;
    this.totalSalesUnits = 0;
    this.totalSalesAmount = 0;
    this.availableUnits = 0;
    this.availableAmount = 0;

    // Single pass calculation
    actionTableList.forEach(action => {
      const units = isNaN(Number(action.num_units)) ? 0 : Number(action.num_units);
      const amount = isNaN(Number(action.amount_invested)) ? 0 : Number(action.amount_invested);

      if (action.trans_type === 'Subscription') {
        this.totalPurchaseUnits += units;
        this.totalPurchaseAmount += amount;
      }
      else if (action.trans_type === 'Distribution') {
        this.totalSalesUnits += units;
        this.totalSalesAmount += amount;
      }
    });

    // Available = Purchases - Sales
    this.availableUnits = this.totalPurchaseUnits - this.totalSalesUnits;
    this.availableAmount = this.totalPurchaseAmount - this.totalSalesAmount;

    // Safety: if any totals are NaN, reset to 0
    this.totalPurchaseUnits ||= 0;
    this.totalPurchaseAmount ||= 0;
    this.totalSalesUnits ||= 0;
    this.totalSalesAmount ||= 0;
    this.availableUnits ||= 0;
    this.availableAmount ||= 0;
  }

  getAIFDetailsFixedIncomeMCAPCount(aifID: string) {
    this.featuresService.getAIFDetailsFixedIncomeMCAPCount(aifID).subscribe({
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
          detail: err.error?.message || 'Failed to load AIF Details MCAP chart'
        })
    });
  }

  getAIFDetailsFixedIncomeSectorCount(aifID: string) {
    this.featuresService.getAIFDetailsFixedIncomeSectorCount(aifID).subscribe({
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
          detail: err.error?.message || 'Failed to load AIF Details Sector chart'
        })
    });
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

  getSeverity(orderType: string) {
    switch (orderType?.trim()?.toUpperCase()) {
      case 'SUBSCRIPTION': return 'success';
      case 'REDEMPTION': return 'danger';
      default: return 'info';
    }
  }

  onEditRow(entity: any) {
    this.editingRow = entity;

    // Clone entity to avoid mutation
    const patchData = { ...entity };

    // Convert order_date string to Date object
    if (patchData.trans_date) {
      const parts = patchData.trans_date.split('-'); // ["08","09","2025"]
      patchData.trans_date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }

    this.aifActionTableForm.patchValue(patchData);
    this.displayActionRowEditDialog = true;
  }

  saveEdit() {
    if (this.aifActionTableForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill required fields correctly' });
      return;
    }

    const updatedData = this.aifActionTableForm.getRawValue(); // includes disabled fields

    if (updatedData.trans_date instanceof Date) {
      const d = updatedData.trans_date;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      updatedData.trans_date = `${year}-${month}-${day}`;
    }

    this.featuresService.updateAIFDetailActionTableRow(this.editingRow.aif_id, updatedData).subscribe({
      next: () => {
        Object.assign(this.editingRow, updatedData);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Order No ${this.editingRow.order_number} updated successfully` });
        this.displayActionRowEditDialog = false;
        this.calculateTotals(this.actionTableList);
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Failed', detail: err.error?.message || 'Update failed' })
    });
  }

  onDeleteRow(entity: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete AMC Name: "${entity.amc_name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.featuresService.deleteAIFDetailActionTableRow(entity.aif_id).subscribe({
          next: () => {
            this.actionTableList = this.actionTableList.filter(row => row.aif_id !== entity.aif_id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `AMC Name ${entity.amc_name} deleted`
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

  isReadOnlyField(key: string): boolean {
    return ['entityid'].includes(key);
  }

}
