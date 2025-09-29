import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { FeaturesService } from '../../../features.service';
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
    MessagesModule,
    TableModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule,
    DatePickerModule,
    ChartModule,
    TagModule
  ],
  providers: [MessageService],
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

  // ---- Table refs
  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('actionTableTransactions') actionTableTransactions!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);
  constructor(private location: Location) {}

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

  goBack(){
    this.location.back();
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
