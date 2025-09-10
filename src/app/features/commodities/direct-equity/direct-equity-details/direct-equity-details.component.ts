import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { FeaturesService } from '../../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-direct-equity-details',
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
    TagModule
  ],
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
