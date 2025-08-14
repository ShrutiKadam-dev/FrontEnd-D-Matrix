import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FeaturesService } from '../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-sub-mutual-fund',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    TableModule,
    InputTextModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule
  ],
  templateUrl: './sub-mutual-fund.component.html',
  styleUrl: './sub-mutual-fund.component.scss'
})
export class SubMutualFundComponent implements OnInit{
  mfId!: string | null;
  mfDetails: any;
  actionTableList: any[] = [];
  underlyingTableList: any[] = [];
  messages: Message[] = [];

  @ViewChild('actionTable') actionTable!: Table;
  @ViewChild('underlyingTable') underlyingTable!: Table;

   private route = inject(ActivatedRoute);
   private featuresService = inject(FeaturesService);

ngOnInit() {
  this.mfId = this.route.snapshot.paramMap.get('id');
  if (this.mfId) {
    this.loadMfDetails(this.mfId);
    this.getMFDetailActionTable(this.mfId);
    this.getMFDetailUnderlyingTable(this.mfId);
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
getMFDetailActionTable(mfId: string) {
  this.featuresService.getMFDetailActionTable(mfId).subscribe({
    next: (data) => {
      this.actionTableList = Array.isArray(data.data) ? data.data : [];
    },
    error: (err) => {
      this.messages = [{
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'Failed to load actions'
      }];
    }
  });
}

getMFDetailUnderlyingTable(mfId: string) {
  this.featuresService.getMFDetailUnderlyingTable(mfId).subscribe({
    next: (data) => {
      this.underlyingTableList = Array.isArray(data.data) ? data.data : [];
    },
    error: (err) => {
      this.messages = [{
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'Failed to load underlying'
      }];
    }
  });
}


}
