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


@Component({
  selector: 'app-sub-aif',
  imports: [ InputTextModule, FormsModule, AutoCompleteModule, CarouselModule, TableModule, CardModule, ChartModule, ButtonModule, CommonModule ],
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
  

  // ---- Table refs
  @ViewChild('actionTableSummary') actionTableSummary!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

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


}
