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
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    TableModule,
    InputTextModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule,
    DatePickerModule,
    ChartModule,
    TagModule
  ],
  templateUrl: './mutual-fund-details.component.html',
  styleUrl: './mutual-fund-details.component.scss'
})


export class MutualFundDetailsComponent implements OnInit {
  mfId!: string | null;
  mfDetails: any;
  chartData: any;
  chartOptions: any;
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
  totalValue = 0

  selectedDate: string = this.underlyingTableList[0]?.created_at?.split('T')[0] || '';

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
      this.fetchIrr(this.mfId)
    }
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
      const units = isNaN(Number(action.unit)) ? 0 : Number(action.unit);
      const amount = isNaN(Number(action.purchase_amount)) ? 0 : Number(action.purchase_amount);

      if (action.order_type === 'Purchase') {
        this.totalPurchaseUnits += units;
        this.totalPurchaseAmount += amount;
      }
      else if (action.order_type === 'Sell') {
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

  onGlobalFilter(event: Event, tableType: 'action' | 'underlying') {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      if (tableType === 'action') {
        this.actionTableSummary.filterGlobal(input.value, 'contains');
      } else {
        this.underlyingTable.filterGlobal(input.value, 'contains');
      }
    }
  }

  loadMfDetails(id: string) {
    this.featuresService.getMutualFundDetailsById(id).subscribe({
      next: (res: any) => { this.mfDetails = res?.data || {}; 
      console.log(this.mfDetails[0].isin);
      
      this.getAllMutualFundDetailsNav(this.mfDetails[0].isin)
    },
      error: (err: any) => { console.error('Failed to load Mutual Fund details', err); }
    });
  }

  getMFDetailActionTable(mfId: string) {
    this.featuresService.getMFDetailActionTable(mfId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
        this.calculateTotals(this.actionTableList);
        const cashflows = this.actionTableList.map((e: any) => ({
          date: e.order_date,
          amount: e.order_type === 'Purchase' ? -e.purchase_amount : +e.purchase_amount
        }));
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
        if (this.allNavs.length > 0) {
          this.allNavs.sort((a: any, b: any) =>
            new Date(b.nav_date).getTime() - new Date(a.nav_date).getTime()
          );
          this.allNavs = [this.allNavs[0]]; // keep only latest NAV
          this.totalValue = this.availableUnits * this.allNavs[0].nav;
        } else {
          this.allNavs = [];
          this.totalValue = 0;
        }

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

        const grouped: { [key: string]: number } = {};
        this.underlyingTableList.forEach((item: any) => {
          const tag = item.tag || 'Unknown';
          grouped[tag] = (grouped[tag] || 0) + 1;
        });

        const total = Object.values(grouped).reduce((sum, v) => sum + v, 0);

        this.actionCounts = {
          lcap_percent: grouped['large cap'] ? (grouped['large cap'] / total) * 100 : 0,
          mcap_percent: grouped['mid cap'] ? (grouped['mid cap'] / total) * 100 : 0,
          scap_percent: grouped['small cap'] ? (grouped['small cap'] / total) * 100 : 0,
          lcap_count: grouped['large cap'] || 0,
          mcap_count: grouped['mid cap'] || 0,
          scap_count: grouped['small cap'] || 0,
          total_count: total
        };

        const labels = ['Large Cap', 'Mid Cap', 'Small Cap'];
        const values = [
          this.actionCounts.lcap_percent,
          this.actionCounts.mcap_percent,
          this.actionCounts.scap_percent
        ];

        this.chartData = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
              hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
            }
          ]
        };

        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw.toFixed(1)}%`
              }
            }
          }
        };
      },
      error: (err) =>
        this.messageService.add({
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
        // Assuming API returns { irr: 0.1234 }
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
    switch (orderType?.trim()?.toUpperCase()) {
      case 'PURCHASE':
        return 'success';
      case 'SELL':
        return 'danger';
      default:
        return 'info';
    }
  }
}
