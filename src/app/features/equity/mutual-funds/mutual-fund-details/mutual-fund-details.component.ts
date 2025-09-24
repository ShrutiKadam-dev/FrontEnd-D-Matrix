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

  chartData: any = {
    labels: [],
    datasets: []
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  actionTableList: any[] = [];
  underlyingTableList: any[] = [];
  actionCounts: any = {};
  totalPurchaseUnits = 0;
  totalPurchaseAmount = 0;
  totalSalesUnits = 0;
  totalSalesAmount = 0;
  availableUnits = 0;
  availableAmount = 0;
  irrResult: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  totalValue = 0;

  mcapChartData: any;
  mcapChartOptions: any;
  sectorChartData: any;
  sectorChartOptions: any;

  selectedDate = '';

  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('actionTableTransactions') actionTableTransactions!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);
  allNavs: any;

  ngOnInit() {
    this.mfId = this.route.snapshot.paramMap.get('id');
    if (this.mfId) {
      this.loadMfDetails(this.mfId);
      this.getMFDetailActionTable(this.mfId);
      this.getMFDetailUnderlyingTable(this.mfId);
      this.getAllMFDetailsEquitySectorCount(this.mfId);
      this.fetchIrr(this.mfId);
    }
  }

  calculateTotals(actionTableList: any[]) {
    if (!Array.isArray(actionTableList) || actionTableList.length === 0) {
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
      const units = Number.isFinite(Number(action.unit)) ? Number(action.unit) : 0;
      const amount = Number.isFinite(Number(action.purchase_amount)) ? Number(action.purchase_amount) : 0;

      if ((action.order_type || '').toString().trim().toUpperCase() === 'PURCHASE') {
        this.totalPurchaseUnits += units;
        this.totalPurchaseAmount += amount;
      } else if ((action.order_type || '').toString().trim().toUpperCase() === 'SELL') {
        this.totalSalesUnits += units;
        this.totalSalesAmount += amount;
      }
    });

    // Available = Purchases - Sales
    this.availableUnits = this.totalPurchaseUnits - this.totalSalesUnits;
    this.availableAmount = this.totalPurchaseAmount - this.totalSalesAmount;

    // Safety: keep valid 0 values (use Number.isFinite)
    this.totalPurchaseUnits = Number.isFinite(this.totalPurchaseUnits) ? this.totalPurchaseUnits : 0;
    this.totalPurchaseAmount = Number.isFinite(this.totalPurchaseAmount) ? this.totalPurchaseAmount : 0;
    this.totalSalesUnits = Number.isFinite(this.totalSalesUnits) ? this.totalSalesUnits : 0;
    this.totalSalesAmount = Number.isFinite(this.totalSalesAmount) ? this.totalSalesAmount : 0;
    this.availableUnits = Number.isFinite(this.availableUnits) ? this.availableUnits : 0;
    this.availableAmount = Number.isFinite(this.availableAmount) ? this.availableAmount : 0;
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

  loadMfDetails(id: string) {
    this.featuresService.getMutualFundDetailsById(id).subscribe({
      next: (res: any) => {
        this.mfDetails = res?.data || {};
        // guard access
        const isin = Array.isArray(this.mfDetails) && this.mfDetails[0]?.isin ? this.mfDetails[0].isin : (this.mfDetails?.isin ?? null);
        if (isin) {
          this.getAllMutualFundDetailsNav(isin);
        }
      },
      error: (err: any) => { console.error('Failed to load Mutual Fund details', err); }
    });
  }

  getMFDetailActionTable(mfId: string) {
    this.featuresService.getMFDetailActionTable(mfId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
        this.calculateTotals(this.actionTableList);
        // If needed later: prepare cashflows for IRR function
        // const cashflows = this.actionTableList.map((e: any) => ({ date: e.order_date, amount: e.order_type === 'Purchase' ? -e.purchase_amount : +e.purchase_amount }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load actions'
        });
      }
    });
  }

  getAllMutualFundDetailsNav(ISIN: string) {
    this.featuresService.getAllMutualFundDetailsNav(ISIN).subscribe({
      next: (data: any) => {
        this.allNavs = Array.isArray(data.data) ? data.data : [];
        const navValue = this.allNavs?.[0]?.nav;
        this.totalValue = Number.isFinite(navValue) ? (navValue * this.availableUnits) : 0;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Update for Nav value failed'
        });
      }
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
          detail: err.error?.message || 'Failed to load Mutual Fund chart'
        })
    });
  }

getAllMFDetailsEquitySectorCount(mfId: string) {
  this.featuresService.getallMfDetailsEquitySectorCount(mfId).subscribe({
    next: (res: any) => {
      if (!res?.data?.length) {
        this.sectorTableList = [];
        this.sectorChartData = null;
        return;
      }

      this.sectorTableList = res.data;

      // Generate dynamic colors using HSL
      const total = this.sectorTableList.length;
      this.sectorTableList.forEach((s: any, i: number) => {
        s.color = `hsl(${(i * 360) / total}, 65%, 55%)`; // evenly spaced hues
      });

      const totalCount = res.data[0]?.total_mf_count || 0;
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
          legend: { display : false },
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
    error: (err) => this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: err.error?.message || 'Failed to load Mutual Fund chart'
    })
  });
}


  // Function to fetch IRR
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getIrrById(entityid).subscribe({
      next: (response) => {
        // Assuming API returns annualized_irr_percent
        this.irrResult = response?.annualized_irr_percent ?? null;
        console.log(entityid, this.irrResult);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching IRR:', err);
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

  // ensure these properties exist so template references compile
  sectorTableList: any[] = [];
  sectorCounts: any = {};
}
