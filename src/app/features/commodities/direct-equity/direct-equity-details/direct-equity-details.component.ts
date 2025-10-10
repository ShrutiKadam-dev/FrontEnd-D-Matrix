import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports'
import { ActivatedRoute } from '@angular/router';
import { FeaturesService } from '../../../features.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-direct-equity-details',
  imports: [SHARED_IMPORTS], 
  providers: [MessageService, ConfirmationService],
  templateUrl: './direct-equity-details.component.html',
  styleUrl: './direct-equity-details.component.scss'
})
export class DirectEquityDetailsComponent implements OnInit {
  deId!: string | null;
  deDetails: any;
  actionTableList: any[] = [];
  irrResult: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  totalPurchaseUnits = 0;
  totalPurchaseAmount = 0;
  totalSalesUnits = 0;
  totalSalesAmount = 0;
  availableUnits = 0;
  availableAmount = 0;

  @ViewChild('actionTable') actionTable!: Table;

  private route = inject(ActivatedRoute);
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);
  constructor(private location: Location) {}

  ngOnInit() {
    this.deId = this.route.snapshot.paramMap.get('id');
    if (this.deId) {
      this.loadMfDetails(this.deId);
      this.getDEDetailActionTable(this.deId);
      this.fetchIrr(this.deId)
    }
  }


  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.actionTable) {
      this.actionTable.filter(input.value, 'global', 'contains');
    }
  }

  goBack(){
    this.location.back();
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

    console.log(actionTableList);

    // Reset totals
    this.totalPurchaseUnits = 0;
    this.totalPurchaseAmount = 0;
    this.totalSalesUnits = 0;
    this.totalSalesAmount = 0;
    this.availableUnits = 0;
    this.availableAmount = 0;

    // Single pass calculation
    actionTableList.forEach(action => {
      const units = isNaN(Number(action.qty)) ? 0 : Number(action.qty);
      const amount = isNaN(Number(action.net_total)) ? 0 : Number(action.net_total);

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


  // Function to fetch IRR
  fetchIrr(entityid: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getDirectEquityIrrById(entityid).subscribe({
      next: (response) => {
        // Assuming API returns { irr: 0.1234 }
        this.irrResult = response?.annualized_irr_percent ?? null;
        console.log(this.irrResult);

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

  loadMfDetails(id: string) {
    this.featuresService.getDirectEquityCommodityDetailsById(id).subscribe({
      next: (res: any) => {
        this.deDetails = res?.data || {};
      },
      error: (err: any) => {
        console.error('Failed to load direct equity details', err);
      }
    });
  }


  getDEDetailActionTable(deId: string) {
    this.featuresService.getDECommodityDetailActionTable(deId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
        this.calculateTotals(this.actionTableList)
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

  getSeverity(orderType: string) {
    switch (orderType?.trim()?.toUpperCase()) {
      case 'BUY':
        return 'success';
      case 'SELL':
        return 'danger';
      default:
        return 'info';
    }
  }

}
