import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { FeaturesService } from '../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';

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
    ChartModule
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
  irr: number = 0;
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

  

  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('actionTableTransactions') actionTableTransactions!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

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
    else if (action.order_type === 'Sale') {
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
      next: (res: any) => { this.mfDetails = res?.data || {}; },
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
        this.irr = this.calculateIRR(cashflows);
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
          lcap_percent: grouped['lcap'] ? (grouped['lcap'] / total) * 100 : 0,
          mcap_percent: grouped['mcap'] ? (grouped['mcap'] / total) * 100 : 0,
          scap_percent: grouped['scap'] ? (grouped['scap'] / total) * 100 : 0
        };


        // Prepare chart
        this.chartData = {
          labels: Object.keys(grouped),
          datasets: [{
            data: Object.values(grouped),
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043', '#26C6DA', '#FFCA28']
          }]
        };

        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = (value / total) * 100;
                  return `${label}: ${value} (${percentage.toFixed(1)}%)`;
                }
              }
            }
          }
        };
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load underlying'
        });
      }
    });
  }

  // Function to fetch IRR
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getIrrById(entityid).subscribe({
      next: (response) => {
        // Assuming API returns { irr: 0.1234 }
        this.irrResult = response?.annualized_irr_percent?? null;
        
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


  private calculateIRR(cashflows: { date: string, amount: number }[]): number {
    if (!cashflows || cashflows.length < 2) return NaN;
    const parseDate = (dateStr: string): Date => {
      if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts[0].length === 4) return new Date(dateStr);
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
      return new Date(dateStr);
    };
    const firstDate = parseDate(cashflows[0].date);
    const lastDate = parseDate(cashflows[cashflows.length - 1].date);
    const years = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    const invested = Math.abs(cashflows.filter(f => f.amount < 0).reduce((sum, f) => sum + f.amount, 0));
    const redeemed = cashflows.filter(f => f.amount > 0).reduce((sum, f) => sum + f.amount, 0);

    if (years < 1) return ((redeemed - invested) / invested) * 100;

    let rate = 0.1, maxIterations = 1000, tolerance = 1e-7;
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0, derivative = 0;
      for (let flow of cashflows) {
        const t = (parseDate(flow.date).getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        npv += flow.amount / Math.pow(1 + rate, t);
        derivative += (-t * flow.amount) / Math.pow(1 + rate, t + 1);
      }
      const newRate = rate - npv / derivative;
      if (Math.abs(newRate - rate) < tolerance) return newRate * 100;
      rate = newRate;
    }
    return NaN;
  }
}
