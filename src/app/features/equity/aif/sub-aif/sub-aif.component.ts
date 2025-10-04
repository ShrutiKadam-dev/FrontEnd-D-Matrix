import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sub-aif',
  imports: [ InputTextModule, 
    TagModule,
    FormsModule, AutoCompleteModule, CarouselModule, TableModule, CardModule, ChartModule, ButtonModule, CommonModule ],
    providers: [MessageService],
  templateUrl: './sub-aif.component.html',
  styleUrl: './sub-aif.component.scss'
})
export class SubAifComponent {

  aifId!: string | null;
  contractNote :any[]= [];
  underlyingList :any[]= [];
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

  // ---- Table refs
  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

  private messageService = inject(MessageService);

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.aifId = this.route.snapshot.paramMap.get('id');
    if(this.aifId){
    this.loadAIFDetails(this.aifId);
    this.getAifActionTableById(this.aifId);
    this.getUnderlyingTable(this.aifId);
    this.getAIFDetailsEquityMCAPCount(this.aifId);
    this.getAIFDetailsEquitySectorCount(this.aifId);
    this.fetchIrr(this.aifId);
    }

  }

  goBack(){
    this.location.back();
  }

  private featuresService = inject(FeaturesService);  

  getAifActionTableById(aifId:string){
    console.log(aifId);
    
    this.featuresService.getAifActionTableById(aifId).subscribe({
      next:(res:any ) => {
        this.contractNote = res?.data || [];
        this.calculateTotals(this.contractNote)
        console.log(this.contractNote);  
      },
       error: () => console.error('Failed to fetch AIF Action Table')
    })
  }

  getUnderlyingTable(aifId:string){
    this.featuresService.getUnderlyingTable(aifId).subscribe({
      next:(res:any ) => {
        this.underlyingList = res?.data || [];
       
      },
       error: () => console.error('Failed to fetch AIF Action Table')
    })

  }

  loadAIFDetails(id: string) {
    this.featuresService.getAIFEquityDetailsById(id).subscribe({
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
        this.irrResult = response?.annualized_irr_percent?? null;
                
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

  getAIFDetailsEquityMCAPCount(aifID: string) {
    this.featuresService.getAIFDetailsEquityMCAPCount(aifID).subscribe({
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

        const totalCount = res.data[0]?.total_mf_count || 0;
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

  getAIFDetailsEquitySectorCount(aifID: string) {
    this.featuresService.getAIFDetailsEquitySectorCount(aifID).subscribe({
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

}
