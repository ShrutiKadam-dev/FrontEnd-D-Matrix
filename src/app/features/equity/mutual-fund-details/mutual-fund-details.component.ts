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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';


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
    FormsModule,DatePickerModule
  ],
  templateUrl: './mutual-fund-details.component.html',
  styleUrl: './mutual-fund-details.component.scss'
})
export class MutualFundDetailsComponent implements OnInit {
  mfId!: string | null;
  mfDetails: any;
  actionTableList: any[] = [];
  underlyingTableList: any[] = [];
  irr: number = 0;

  @ViewChild('actionTable') actionTable!: Table;
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
    }
    
     
  }


  onGlobalFilter(event: Event, tableType: 'action' | 'underlying') {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      if (tableType === 'action') {
        this.actionTable.filterGlobal(input.value, 'contains');
      } else {
        this.underlyingTable.filterGlobal(input.value, 'contains');
      }
    }
  }

  loadMfDetails(id: string) {
    this.featuresService.getMutualFundDetailsById(id).subscribe({
      next: (res: any) => {
        this.mfDetails = res?.data || {};
      },
      error: (err: any) => {
        console.error('Failed to load Mutual Fund details', err);
      }
    });
  }


  getMFDetailActionTable(mfId: string) {
    this.featuresService.getMFDetailActionTable(mfId).subscribe({
      next: (data) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
        const cashflows =  this.actionTableList.map((e: any) => ({
      date: e.order_date,
      amount: e.order_type === 'Purchase'
        ? -(e.purchase_amount)
        : +(e.purchase_amount)
    })
    
  );
  this.irr = this.calculateIRR(cashflows);
  console.log(cashflows);
  


  console.log("IRR:", this.irr + "%");
  
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



private calculateIRR(cashflows: { date: string, amount: number }[]): number {
  if (!cashflows || cashflows.length < 2) return NaN;

  // helper: parse both YYYY-MM-DD and DD-MM-YYYY
  const parseDate = (dateStr: string): Date => {
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      // check if first part is year (ISO format)
      if (parts[0].length === 4) {
        return new Date(dateStr); // YYYY-MM-DD → safe
      } else {
        // DD-MM-YYYY → convert
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
    }
    return new Date(dateStr); // fallback
  };

  const firstDate = parseDate(cashflows[0].date);
  const lastDate = parseDate(cashflows[cashflows.length - 1].date);
  const years = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

  // 👉 If less than 1 year, just return absolute % return
  const invested = Math.abs(
    cashflows.filter(f => f.amount < 0).reduce((sum, f) => sum + f.amount, 0)
  );
  const redeemed = cashflows.filter(f => f.amount > 0).reduce((sum, f) => sum + f.amount, 0);

  if (years < 1) {
    return ((redeemed - invested) / invested) * 100; // absolute return %
  }

  // 👉 Otherwise, do proper IRR (annualized)
  const maxIterations = 1000;
  const tolerance = 1e-7;
  let rate = 0.1; // initial guess = 10%

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let flow of cashflows) {
      const t = (parseDate(flow.date).getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      npv += flow.amount / Math.pow(1 + rate, t);
      derivative += (-t * flow.amount) / Math.pow(1 + rate, t + 1);
    }

    const newRate = rate - npv / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // annualized %
    }
    rate = newRate;
  }

  return NaN;
}

}
