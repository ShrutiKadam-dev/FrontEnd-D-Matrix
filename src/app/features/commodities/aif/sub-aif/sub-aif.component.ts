import { Component, inject, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports'
import { ActivatedRoute } from '@angular/router';
import { FeaturesService } from '../../../features.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sub-aif',
  imports: [SHARED_IMPORTS], 
  providers: [MessageService, ConfirmationService],
  templateUrl: './sub-aif.component.html',
  styleUrl: './sub-aif.component.scss'
})

export class SubAifComponent {

  aifId!: string;
  contractNote :any[]= [];
  underlyingList :any[]= [];
  actionCounts: any = {};
  irrResult: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  totalPurchaseUnits = 0;
  totalPurchaseAmount = 0;
  totalSalesUnits = 0;
  totalSalesAmount = 0;
  availableUnits = 0;
  availableAmount = 0; 
  chartData: any;
  chartOptions: any;
  

  @ViewChild('dt') dt!: Table;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.aifId = this.route.snapshot.paramMap.get('id')!; 
    this.getAifActionTableById(this.aifId)
    this.getUnderlyingTable(this.aifId)
    this.fetchIrr(this.aifId)

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
        const grouped: { [key: string]: number } = {};
        this.underlyingList.forEach((item: any) => {
          const tag = item.tag || 'Unknown';
          grouped[tag] = (grouped[tag] || 0) + 1;
        });

        const total = Object.values(grouped).reduce((sum, v) => sum + v, 0);

        this.actionCounts = {
          lcap_percent: grouped['large cap'] ? (grouped['large cap'] / total) * 100 : 0,
          mcap_percent: grouped['mid cap'] ? (grouped['mid cap'] / total) * 100 : 0,
          scap_percent: grouped['small cap'] ? (grouped['small cap'] / total) * 100 : 0
        };


        // Prepare chart
        this.chartData = {
          labels: Object.keys(grouped),
          datasets: [{
            data: Object.values(grouped),
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043', '#26C6DA', '#FFCA28']
          }]
        };

        console.log(grouped, this.chartData);

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
        
          console.log(this.actionCounts);
        
      },
       error: () => console.error('Failed to fetch AIF Action Table')
    })

  }

    // Function to fetch IRR
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getAifIrrById(entityid).subscribe({
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

  console.log(actionTableList)

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


  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }



}
